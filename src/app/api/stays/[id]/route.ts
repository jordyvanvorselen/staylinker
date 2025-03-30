import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET a specific stay by ID
export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  try {
    const stay = await prisma.stay.findUnique({
      where: { id },
    });

    if (!stay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
    }

    return NextResponse.json(stay);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stay' }, { status: 500 });
  }
}

// PUT update a stay
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  try {
    const data = await request.json();

    // Check if stay exists
    const existingStay = await prisma.stay.findUnique({
      where: { id },
    });

    if (!existingStay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
    }

    // Update the stay
    const updatedStay = await prisma.stay.update({
      where: { id },
      data: {
        location: data.location,
        address: data.address,
        arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : undefined,
        departureDate: data.departureDate ? new Date(data.departureDate) : undefined,
        notes: data.notes,
        arrivalNotes: data.arrivalNotes,
        departureNotes: data.departureNotes,
        // We don't update tripId here to prevent moving stays between trips
        // If that's needed, it should be a specific operation
      },
    });

    return NextResponse.json(updatedStay);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stay' }, { status: 500 });
  }
}

// DELETE a stay
export async function DELETE(_request: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  try {
    // Check if stay exists
    const existingStay = await prisma.stay.findUnique({
      where: { id },
    });

    if (!existingStay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
    }

    // Delete the stay
    await prisma.stay.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete stay' }, { status: 500 });
  }
}
