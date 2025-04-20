import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// POST: Create a new stay for a trip
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Get the user's session token
    const token = await getToken({ req: request });

    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tripId = id;

    // Check if trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check if the user has access to this trip via TripUser relationship
    const tripUser = await prisma.tripUser.findUnique({
      where: {
        userId_tripId: {
          userId: token.id as string,
          tripId,
        },
      },
    });

    if (!tripUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if user has the required permission (must be a member, not a guest)
    if (tripUser.role === 'guest') {
      return NextResponse.json(
        { error: 'Guests can only view trip information but cannot create stays' },
        { status: 403 },
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.location || !data.address || !data.arrivalDate || !data.departureDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract contacts from the data if they exist
    const { contacts, ...stayData } = data;

    // Create new stay with contacts if provided
    const newStay = await prisma.stay.create({
      data: {
        location: stayData.location,
        address: stayData.address,
        arrivalDate: new Date(stayData.arrivalDate),
        departureDate: new Date(stayData.departureDate),
        arrivalTime: stayData.arrivalTime || null,
        departureTime: stayData.departureTime || null,
        arrivalNotes: stayData.arrivalNotes || null,
        departureNotes: stayData.departureNotes || null,
        notes: stayData.notes || null,
        arrivalConfirmed: stayData.arrivalConfirmed === true,
        departureConfirmed: stayData.departureConfirmed === true,
        trip: { connect: { id: tripId } },
        ...(contacts && contacts.length > 0
          ? {
              contacts: {
                create: contacts.map((contact: { name: string; phone: string }) => ({
                  name: contact.name,
                  phone: contact.phone,
                })),
              },
            }
          : {}),
      },
      include: {
        contacts: true, // Include contacts in the response
      },
    });

    return NextResponse.json(newStay, { status: 201 });
  } catch (_error) {
    console.error('Error creating stay:', _error);
    return NextResponse.json({ error: 'Failed to create stay' }, { status: 500 });
  }
}

// GET: Get all stays for a trip
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Get the user's session token
    const token = await getToken({ req: request });

    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tripId = id;

    // Check if trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stays: {
          include: {
            contacts: true, // Include contacts for each stay
          },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check if the user has access to this trip via TripUser relationship
    const tripUser = await prisma.tripUser.findUnique({
      where: {
        userId_tripId: {
          userId: token.id as string,
          tripId,
        },
      },
    });

    if (!tripUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(trip.stays);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch stays' }, { status: 500 });
  }
}
