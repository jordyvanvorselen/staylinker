'use client';

import { useEffect, useState } from 'react';
import { Bell, ArrowLeft, Check, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Invitation {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tripId: string;
  senderId: string;
  trip: {
    name: string;
    description?: string;
  };
  sender: {
    name?: string;
    email?: string;
    image?: string;
  };
}

interface InvitationResponse {
  invitation: Invitation;
  trip?: {
    id: string;
    name: string;
  };
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingInvitations, setProcessingInvitations] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/invitations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch invitations');
        }
        
        const data = await response.json();
        // Filter out any invitations that aren't pending
        setInvitations(data.filter((inv: Invitation) => inv.status === 'pending'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvitations();
  }, []);
  
  const handleInvitationResponse = async (invitationId: string, status: 'accepted' | 'declined') => {
    try {
      // Update local state to show processing
      setProcessingInvitations(prev => ({
        ...prev,
        [invitationId]: status === 'accepted' ? 'accepting' : 'declining'
      }));
      
      // Send request to API
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${status} invitation`);
      }
      
      const data: InvitationResponse = await response.json();
      
      // Remove the invitation from the list
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
      // Show feedback to user
      if (status === 'accepted') {
        // If accepted, redirect to the new trip
        if (data.trip) {
          // Give a small delay for better UX
          setTimeout(() => {
            router.push(`/trips/${data.trip!.id}`);
          }, 500);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Reset processing state
      setProcessingInvitations(prev => {
        const newState = { ...prev };
        delete newState[invitationId];
        return newState;
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="mb-6">
        <Link 
          href="/"
          className="btn btn-ghost btn-sm gap-2 hover:bg-base-200 active:bg-base-300 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-base-300"
          aria-label="Back to trips"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trips
        </Link>
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Trip Invitations</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : invitations.length === 0 ? (
        <div className="card bg-base-100 shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="font-medium text-lg mb-2">No pending invitations</h3>
          <p className="text-gray-600">When someone invites you to a trip, you'll see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="card bg-base-200 shadow-md">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-lg">{invitation.trip.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {invitation.trip.description || 'No description provided'}
                    </p>
                  </div>
                  <div className="badge badge-primary">Pending</div>
                </div>
                
                <div className="divider my-2"></div>
                
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      {invitation.sender.image ? (
                        <img src={invitation.sender.image} alt={invitation.sender.name || 'Sender'} />
                      ) : (
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-full h-full flex items-center justify-center">
                          {invitation.sender.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Invited by {invitation.sender.name || invitation.sender.email || 'Unknown user'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(invitation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="card-actions justify-end mt-4">
                  {processingInvitations[invitation.id] ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm">
                        {processingInvitations[invitation.id] === 'accepting' ? 'Accepting...' : 'Declining...'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <button 
                        className="btn btn-sm btn-outline gap-1"
                        onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                        disabled={!!processingInvitations[invitation.id]}
                      >
                        <X className="h-4 w-4" />
                        Decline
                      </button>
                      <button 
                        className="btn btn-sm btn-primary gap-1"
                        onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                        disabled={!!processingInvitations[invitation.id]}
                      >
                        <Check className="h-4 w-4" />
                        Accept
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
