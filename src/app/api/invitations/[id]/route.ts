import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// PUT: Update an invitation status (accept or decline)
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;
  
  try {
    // Get the user's session token
    const token = await getToken({ req: request });
    
    if (!token || !token.id || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.status || !['accepted', 'declined'].includes(data.status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }
    
    // Find the invitation
    const invitation = await prisma.tripInvitation.findUnique({
      where: { id },
      include: {
        trip: true
      }
    });
    
    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }
    
    // Ensure the invitation is for this user
    if (invitation.email !== token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Handle accept/decline logic
    if (data.status === 'accepted') {
      // Accept the invitation
      // 1. Update the invitation status
      const updatedInvitation = await prisma.tripInvitation.update({
        where: { id },
        data: {
          status: 'accepted',
          invitee: {
            connect: { id: token.id as string }
          }
        }
      });
      
      // 2. Add the user to the shared trip via TripUser relation
      // First check if the relationship already exists
      const existingTripUser = await prisma.tripUser.findUnique({
        where: {
          userId_tripId: {
            userId: token.id as string,
            tripId: invitation.tripId
          }
        }
      });
      
      // Only create the relationship if it doesn't exist yet
      if (!existingTripUser) {
        await prisma.tripUser.create({
          data: {
            user: { connect: { id: token.id as string } },
            trip: { connect: { id: invitation.tripId } }
          }
        });
      }
      
      // Fetch the trip details to return to the client
      const trip = await prisma.trip.findUnique({
        where: { id: invitation.tripId }
      });
      
      return NextResponse.json({
        invitation: updatedInvitation,
        trip
      });
    } else {
      // Decline the invitation
      const updatedInvitation = await prisma.tripInvitation.update({
        where: { id },
        data: {
          status: 'declined',
          invitee: {
            connect: { id: token.id as string }
          }
        }
      });
      
      return NextResponse.json(updatedInvitation);
    }
  } catch (error) {
    console.error('Error processing invitation response:', error);
    return NextResponse.json({ error: 'Failed to process invitation' }, { status: 500 });
  }
}
