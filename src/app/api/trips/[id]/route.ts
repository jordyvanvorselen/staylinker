import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET a specific trip by ID
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: {
        stays: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trip' }, { status: 500 });
  }
}

// PUT update a trip
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();

    // Check if trip exists
    const existingTrip = await prisma.trip.findUnique({
      where: { id: params.id },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Update the trip
    const updatedTrip = await prisma.trip.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return NextResponse.json(updatedTrip);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}

// DELETE a trip
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if trip exists
    const existingTrip = await prisma.trip.findUnique({
      where: { id: params.id },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Delete the trip (will cascade delete all related stays)
    await prisma.trip.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 });
  }
}
