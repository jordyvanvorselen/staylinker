import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stayId: string }> }
) {
  try {
    // Get the user's session token
    const token = await getToken({ req: request });

    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: tripId, stayId } = await params;

    // Check if trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check if the user has access to this trip
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

    // Get stay
    const stay = await prisma.stay.findUnique({
      where: {
        id: stayId,
        tripId,
      },
    });

    if (!stay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
    }

    return NextResponse.json(stay);
  } catch (error) {
    console.error('Error fetching stay:', error);
    return NextResponse.json({ error: 'Failed to fetch stay' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stayId: string }> }
) {
  try {
    // Get the user's session token
    const token = await getToken({ req: request });

    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: tripId, stayId } = await params;

    // Check if trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check if the user has access to this trip
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

    // Get stay to confirm it exists and belongs to this trip
    const existingStay = await prisma.stay.findUnique({
      where: {
        id: stayId,
        tripId,
      },
    });

    if (!existingStay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.location || !data.address || !data.arrivalDate || !data.departureDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update stay
    const updatedStay = await prisma.stay.update({
      where: { id: stayId },
      data: {
        location: data.location,
        address: data.address,
        arrivalDate: new Date(data.arrivalDate),
        departureDate: new Date(data.departureDate),
        arrivalNotes: data.arrivalNotes || null,
        departureNotes: data.departureNotes || null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(updatedStay);
  } catch (error) {
    console.error('Error updating stay:', error);
    return NextResponse.json({ error: 'Failed to update stay' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stayId: string }> }
) {
  try {
    // Get the user's session token
    const token = await getToken({ req: request });

    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: tripId, stayId } = await params;

    // Check if trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check if the user has access to this trip
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

    // Get stay to confirm it exists and belongs to this trip
    const existingStay = await prisma.stay.findUnique({
      where: {
        id: stayId,
        tripId,
      },
    });

    if (!existingStay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
    }

    // Delete stay
    await prisma.stay.delete({
      where: { id: stayId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stay:', error);
    return NextResponse.json({ error: 'Failed to delete stay' }, { status: 500 });
  }
}
