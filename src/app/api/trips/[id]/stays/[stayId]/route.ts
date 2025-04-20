import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stayId: string }> },
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

    // Get stay with contacts
    const stay = await prisma.stay.findUnique({
      where: {
        id: stayId,
        tripId,
      },
      include: {
        contacts: true, // Include contacts in the response
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
  { params }: { params: Promise<{ id: string; stayId: string }> },
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

    // Extract contacts from the data if they exist
    const { contacts, ...stayData } = data;

    // Start a transaction to update both the stay and its contacts
    const updatedStay = await prisma.$transaction(async tx => {
      // First delete all existing contacts for this stay
      if (contacts !== undefined) {
        await tx.contact.deleteMany({
          where: { stayId },
        });
      }

      // Update the stay
      await tx.stay.update({
        where: { id: stayId },
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
        },
      });

      // Create new contacts if they were provided
      if (contacts && contacts.length > 0) {
        await tx.contact.createMany({
          data: contacts.map((contact: { name: string; phone: string }) => ({
            name: contact.name,
            phone: contact.phone,
            stayId: stayId,
          })),
        });
      }

      // Return the updated stay with its new contacts
      return tx.stay.findUnique({
        where: { id: stayId },
        include: { contacts: true },
      });
    });

    return NextResponse.json(updatedStay);
  } catch (error) {
    console.error('Error updating stay:', error);
    return NextResponse.json({ error: 'Failed to update stay' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stayId: string }> },
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

    // Delete stay (contacts will be deleted automatically due to CASCADE)
    await prisma.stay.delete({
      where: { id: stayId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stay:', error);
    return NextResponse.json({ error: 'Failed to delete stay' }, { status: 500 });
  }
}
