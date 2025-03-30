import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// GET: Get all invitations for the current user
export async function GET(request: NextRequest) {
  try {
    // Get the user's session token
    const token = await getToken({ req: request });
    
    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user's email
    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
    });
    
    if (!user || !user.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find all invitations for this user's email that are still pending
    const invitations = await prisma.tripInvitation.findMany({
      where: {
        email: user.email,
        status: 'pending',
      },
      include: {
        trip: true,
        sender: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json(invitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
  }
}
