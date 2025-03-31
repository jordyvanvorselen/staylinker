import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET a specific stay by ID
export async function GET(_request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const stay = await prisma.stay.findUnique({
      where: { id },
    });

    if (!stay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
    }

    return NextResponse.json(stay);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch stay' }, { status: 500 });
  }
}

// PUT update a stay
export async function PUT(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await request.json();

    // Check if stay exists
    const existingStay = await prisma.stay.findUnique({
      where: { id },
    });

    if (!existingStay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
    }

    // Prepare update data without undefined values
    const updateData: any = {};
    
    // Only include fields that are present in the request
    if (data.location !== undefined) updateData.location = data.location;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.arrivalDate !== undefined) updateData.arrivalDate = new Date(data.arrivalDate);
    if (data.departureDate !== undefined) updateData.departureDate = new Date(data.departureDate);
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.arrivalNotes !== undefined) updateData.arrivalNotes = data.arrivalNotes;
    if (data.departureNotes !== undefined) updateData.departureNotes = data.departureNotes;
    // We don't update tripId here to prevent moving stays between trips
    
    // Update the stay
    const updatedStay = await prisma.stay.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedStay);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to update stay' }, { status: 500 });
  }
}

// DELETE a stay
export async function DELETE(_request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to delete stay' }, { status: 500 });
  }
}
