import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// GET a specific trip by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the user's session token
    const token = await getToken({ req: request });
    
    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: {
        stays: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    
    // Ensure the user owns this trip
    if (trip.userId !== token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trip' }, { status: 500 });
  }
}

// PUT update a trip
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the user's session token
    const token = await getToken({ req: request });
    
    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();

    // Check if trip exists
    const existingTrip = await prisma.trip.findUnique({
      where: { id: params.id },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    
    // Ensure the user owns this trip
    if (existingTrip.userId !== token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the user's session token
    const token = await getToken({ req: request });
    
    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if trip exists
    const existingTrip = await prisma.trip.findUnique({
      where: { id: params.id },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    
    // Ensure the user owns this trip
    if (existingTrip.userId !== token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
