'use client';

import { useState } from 'react';
import { Trip } from '@/types';
import { format } from 'date-fns';
import { Calendar, MapPin, ClipboardList } from 'lucide-react';
import Image from 'next/image';

interface TripCardProps {
  trip: Trip;
  onClick?: (_trip: Trip) => void;
}

const TripCard = ({ trip, onClick }: TripCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(trip);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Calculate trip duration if it has stays
  const getTripDates = () => {
    if (!trip.stays || trip.stays.length === 0) {
      return { startDate: '', endDate: '', duration: 0 };
    }

    const stayDates = trip.stays.map(stay => ({
      arrival: new Date(stay.arrivalDate),
      departure: new Date(stay.departureDate),
    }));

    // Find earliest arrival and latest departure - with null checks
    const firstStay = stayDates[0];
    if (!firstStay) {
      return { startDate: '', endDate: '', duration: 0 };
    }

    const startDate = stayDates.reduce(
      (earliest, curr) => (curr.arrival < earliest ? curr.arrival : earliest),
      firstStay.arrival,
    );

    const endDate = stayDates.reduce(
      (latest, curr) => (curr.departure > latest ? curr.departure : latest),
      firstStay.departure,
    );

    const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      duration: dayCount,
    };
  };

  const { startDate, endDate, duration } = getTripDates();
  const stayCount = trip.stays?.length || 0;

  return (
    <div
      className="card bg-base-200/30 shadow-md hover:shadow-xl active:shadow-sm transition-all duration-300 cursor-pointer overflow-hidden rounded-xl ring-1 ring-base-300 hover:ring-primary/30 active:ring-primary/50 hover:translate-y-[-2px] active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-primary/40"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`Trip to ${trip.name}`}
      role="button"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-base-200/30 py-3 px-6 flex justify-between items-center border-b border-base-300/20">
        <div className="flex items-center gap-2">
          <span className="font-medium text-md">{trip.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="badge badge-primary badge-sm">
            {stayCount} {stayCount === 1 ? 'stay' : 'stays'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="card-body p-6 bg-base-200/10">
        <div className="flex flex-col items-center mb-3">
          {trip.description && (
            <p className="text-sm text-gray-600 text-center mb-4">{trip.description}</p>
          )}

          {startDate && endDate && (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="text-sm">Start:</span>
                </div>
                <span className="font-medium text-sm">{formatDate(startDate)}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm">End:</span>
                </div>
                <span className="font-medium text-sm">{formatDate(endDate)}</span>
              </div>

              <div className="badge badge-accent badge-outline w-full justify-center mt-2 py-2">
                {duration} {duration === 1 ? 'day' : 'days'}
              </div>
            </div>
          )}
        </div>

        {stayCount > 0 && (
          <div className="mt-4 w-full">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Destinations</div>
            <div className="flex flex-wrap gap-2">
              {trip.stays?.map((stay, index) => (
                <div key={index} className="badge badge-outline badge-sm gap-1">
                  <MapPin className="w-3 h-3" />
                  {stay.location}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="bg-gradient-to-tr from-accent/10 via-accent/5 to-base-200/30 py-2 px-6 flex justify-between items-center border-t border-base-300/20">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-500">Created {formatDate(trip.createdAt)}</span>
        </div>

        {/* Trip members */}
        <div className="flex items-center gap-2">
          {trip.users && trip.users.length > 0 && (
            <div className="flex -space-x-2 ml-2" aria-label="Trip members">
              {/* Show owner first */}
              {trip.owner && (
                <div className="avatar z-10" title={`Owner: ${trip.owner.name || 'Unknown'}`}>
                  <div className="w-6 h-6 rounded-full ring-2 ring-primary ring-offset-1 ring-offset-base-100">
                    {trip.owner.image ? (
                      <Image
                        src={trip.owner.image}
                        alt={trip.owner.name || 'Trip owner'}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                        {trip.owner.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Show first 3 other members */}
              {trip.users
                .filter(tripUser => tripUser.user.id !== trip.ownerId)
                .slice(0, 3)
                .map(tripUser => (
                  <div
                    key={tripUser.user.id}
                    className="avatar"
                    title={tripUser.user.name || 'Trip member'}
                  >
                    <div className="w-6 h-6 rounded-full ring-1 ring-base-300 ring-offset-1 ring-offset-base-100">
                      {tripUser.user.image ? (
                        <Image
                          src={tripUser.user.image}
                          alt={tripUser.user.name || 'Trip member'}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="bg-base-300 text-base-content flex items-center justify-center text-xs font-bold">
                          {tripUser.user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              {/* Show count of additional members */}
              {trip.users.filter(tripUser => tripUser.user.id !== trip.ownerId).length > 3 && (
                <div className="avatar placeholder">
                  <div className="w-6 h-6 rounded-full bg-neutral text-neutral-content ring-1 ring-base-300 flex items-center justify-center text-xs">
                    <span>
                      +{trip.users.filter(tripUser => tripUser.user.id !== trip.ownerId).length - 3}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;
