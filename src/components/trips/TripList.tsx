'use client';

import { useEffect, useState } from 'react';
import { Trip } from '@/types';
import TripCard from './TripCard';
import { Plane, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TripList = () => {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/trips');

      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }

      const data = await response.json();

      // Sort trips by created date (newest first)
      const sortedTrips = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setTrips(sortedTrips);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleTripClick = (trip: Trip) => {
    // Navigate to the trip detail page
    router.push(`/trips/${trip.id}`);
  };

  // No longer needed since we use Link components for navigation

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading trips: {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8 pt-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Trips</h1>
        <Link
          href="/trips/new"
          className="flex items-center justify-center bg-primary text-primary-content rounded-full p-3 shadow-sm hover:shadow-md active:shadow-inner active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-2"
          aria-label="Add a new trip"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="card bg-base-100 shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Plane className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="font-medium text-lg mb-2">No trips found</h3>
          <p className="text-gray-600 mb-6">
            Start planning your adventures by creating your first trip!
          </p>
          <div className="flex justify-center">
            <Link
              href="/trips/new"
              className="flex items-center justify-center bg-primary text-primary-content rounded-full p-4 shadow-sm hover:shadow-md active:shadow-inner active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-2"
              aria-label="Create your first trip"
            >
              <Plus className="h-8 w-8" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display all trips in a grid layout */}
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onClick={handleTripClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TripList;
