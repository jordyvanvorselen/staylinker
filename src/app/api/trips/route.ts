import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET all trips
export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        stays: true,
      },
    });
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

// POST create a new trip
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: 'Trip name is required' }, { status: 400 });
    }

    const newTrip = await prisma.trip.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}
