import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET all stays or filter by tripId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('tripId');

    // Prepare query options
    const queryOptions: any = {
      orderBy: {
        arrivalDate: 'asc',
      },
    };

    // Only add where clause if tripId is provided
    if (tripId) {
      queryOptions.where = { tripId };
    }

    const stays = await prisma.stay.findMany(queryOptions);

    return NextResponse.json(stays);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch stays' }, { status: 500 });
  }
}

// POST create a new stay
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (
      !data.location ||
      !data.address ||
      !data.arrivalDate ||
      !data.departureDate ||
      !data.tripId
    ) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: location, address, arrivalDate, departureDate, and tripId are required',
        },
        { status: 400 },
      );
    }

    // Verify the trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: data.tripId },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const newStay = await prisma.stay.create({
      data: {
        location: data.location,
        address: data.address,
        arrivalDate: new Date(data.arrivalDate),
        departureDate: new Date(data.departureDate),
        notes: data.notes,
        arrivalNotes: data.arrivalNotes,
        departureNotes: data.departureNotes,
        tripId: data.tripId,
      },
    });

    return NextResponse.json(newStay, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to create stay' }, { status: 500 });
  }
}
