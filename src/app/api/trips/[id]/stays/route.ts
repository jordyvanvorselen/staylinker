import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// POST: Create a new stay for a trip
export async function POST(request: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
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
          tripId
        }
      }
    });
    
    if (!tripUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.location || !data.address || !data.arrivalDate || !data.departureDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new stay
    const newStay = await prisma.stay.create({
      data: {
        location: data.location,
        address: data.address,
        arrivalDate: new Date(data.arrivalDate),
        departureDate: new Date(data.departureDate),
        arrivalNotes: data.arrivalNotes || null,
        departureNotes: data.departureNotes || null,
        notes: data.notes || null,
        trip: { connect: { id: tripId } }
      },
    });
    
    return NextResponse.json(newStay, { status: 201 });
  } catch (error) {
    console.error('Error creating stay:', error);
    return NextResponse.json({ error: 'Failed to create stay' }, { status: 500 });
  }
}

// GET: Get all stays for a trip
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
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
      include: { stays: true }
    });
    
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    
    // Check if the user has access to this trip via TripUser relationship
    const tripUser = await prisma.tripUser.findUnique({
      where: {
        userId_tripId: {
          userId: token.id as string,
          tripId
        }
      }
    });
    
    if (!tripUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    return NextResponse.json(trip.stays);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stays' }, { status: 500 });
  }
}
