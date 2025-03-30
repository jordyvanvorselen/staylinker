import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// GET all trips for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get the user's session token
    const token = await getToken({ req: request });
    
    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Find all trips for the current user
    const trips = await prisma.trip.findMany({
      where: {
        userId: token.id as string
      },
      include: {
        stays: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

// POST create a new trip
export async function POST(request: NextRequest) {
  try {
    // Get the user's session token
    const token = await getToken({ req: request });
    
    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: 'Trip name is required' }, { status: 400 });
    }

    const newTrip = await prisma.trip.create({
      data: {
        name: data.name,
        description: data.description,
        userId: token.id as string, // Associate with the current user
      },
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}
