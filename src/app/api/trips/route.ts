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

    // Find all trips the user has access to via TripUser junction table
    const trips = await prisma.trip.findMany({
      where: {
        users: {
          some: {
            userId: token.id as string,
          },
        },
      },
      include: {
        stays: true,
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        // Include other users who have access to the trip
        users: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(trips);
  } catch (_error) {
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
        owner: {
          connect: { id: token.id as string },
        },
        // Also add the owner as a user with access to the trip via TripUser
        users: {
          create: [
            {
              user: {
                connect: { id: token.id as string },
              },
            },
          ],
        },
      },
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}
