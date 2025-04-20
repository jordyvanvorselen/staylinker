'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Trip, Stay } from '@/types';
import { ArrowLeft, Calendar, Plus } from 'lucide-react';
import Link from 'next/link';
import StayCard from '@/components/stays/StayCard';
import StayDistance from '@/components/stays/StayDistance';
import AddStayPrompt from '@/components/trips/AddStayPrompt';
import InviteUserForm from '@/components/trips/InviteUserForm';

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params['id'] as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('guest'); // Default to guest for security

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/trips/${tripId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch trip details');
        }

        const data = await response.json();
        setTrip(data);

        // Use the currentUserRole sent directly from the API
        if (data.currentUserRole) {
          console.log('Current user role from API:', data.currentUserRole);
          setUserRole(data.currentUserRole);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  const isGuest = userRole === 'guest';

  console.log('Current user role:', userRole);
  console.log('Is guest?', isGuest);

  const handleStayClick = (stay: Stay) => {
    // In a future implementation, this would navigate to the stay detail page
    console.log('Stay clicked:', stay);
  };

  if (isLoading) {
    return (
      <div className="hero min-h-[50vh]">
        <div className="hero-content text-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="hero min-h-[50vh]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="alert alert-error">
              <span>{error || 'Trip not found'}</span>
            </div>
            <div className="mt-4">
              <Link href="/" className="btn btn-primary">
                Back to Trips
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/"
          className="btn btn-ghost btn-sm gap-2 hover:bg-base-200 active:bg-base-300 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-base-300"
          aria-label="Back to trips"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trips
        </Link>

        <div className="flex items-center gap-2">
          {!isGuest && (
            <>
              <InviteUserForm tripId={tripId} />

              <Link
                href={`/trips/${tripId}/stays/new`}
                className="btn btn-primary btn-sm"
                aria-label="Add a new stay"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Stay
              </Link>
            </>
          )}
        </div>
      </div>

      {!trip.stays || trip.stays.length === 0 ? (
        <div className="card bg-base-100 shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="font-medium text-lg mb-2">No stays found</h3>
          <p className="text-gray-600 mb-6">
            {isGuest ? "This trip doesn't have any stays yet" : 'Add your first stay to this trip!'}
          </p>

          {!isGuest && (
            <div className="flex justify-center">
              <Link
                href={`/trips/${tripId}/stays/new`}
                className="btn btn-primary gap-2 hover:shadow-md active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-2"
                aria-label="Add your first stay"
              >
                <Plus className="h-5 w-5" />
                Add First Stay
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-4xl mx-auto">
          {/* Display all stays with distances between them */}
          {[...trip.stays]
            .sort((a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime())
            .map((stay, index, sortedStays) => (
              <div key={stay.id}>
                <StayCard stay={stay} onClick={handleStayClick} isGuest={isGuest} />

                {/* Show distance to next stay if there is one */}
                {index < sortedStays.length - 1 && sortedStays[index + 1] && (
                  <StayDistance originStay={stay} destinationStay={sortedStays[index + 1]!} />
                )}
              </div>
            ))}

          {/* Add the 'Add New Stay' prompt at the end of the timeline */}
          {!isGuest && <AddStayPrompt tripId={tripId} />}
        </div>
      )}
    </div>
  );
}
