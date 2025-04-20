import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// POST: Send an invitation to a user for a trip
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    // Ensure the user has access to this trip
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

    // Only trip owner should be able to send invites
    if (trip.ownerId !== token.id) {
      return NextResponse.json(
        { error: 'Only the trip owner can send invitations' },
        { status: 403 },
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.tripInvitation.findFirst({
      where: {
        tripId,
        email: data.email,
        status: 'pending',
      },
    });

    if (existingInvitation) {
      return NextResponse.json({ error: 'Invitation already sent' }, { status: 400 });
    }

    // Find the target user (if they exist)
    const targetUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Create the invitation
    const invitation = await prisma.tripInvitation.create({
      data: {
        email: data.email,
        trip: { connect: { id: tripId } },
        sender: { connect: { id: token.id as string } },
        // Connect the invitee if they exist in the system
        ...(targetUser ? { invitee: { connect: { id: targetUser.id } } } : {}),
      },
    });

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}
