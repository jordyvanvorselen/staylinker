'use client';

import { useEffect, useState } from 'react';
import { Stay } from '../../types';
import { CarFront, ExternalLink } from 'lucide-react';
import DashedConnector from '../ui/DashedConnector';
import GapIndicator from './GapIndicator';

interface StayDistanceProps {
  originStay: Stay;
  destinationStay: Stay;
}

interface DistanceData {
  distance: string;
  duration: string;
  error?: string;
}

const StayDistance = ({ originStay, destinationStay }: StayDistanceProps) => {
  const [distanceData, setDistanceData] = useState<DistanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGap, setHasGap] = useState(false);

  useEffect(() => {
    // Check if there's a gap (more than 2 days) between stays
    const originDepartureDate = new Date(originStay.departureDate);
    const destinationArrivalDate = new Date(destinationStay.arrivalDate);

    // Calculate gap in milliseconds and convert to days
    const gapInMs = destinationArrivalDate.getTime() - originDepartureDate.getTime();
    const gapInDays = gapInMs / (1000 * 60 * 60 * 24);

    // If gap is more than 2 days, we don't calculate distance
    if (gapInDays > 2) {
      setHasGap(true);
      return;
    } else {
      setHasGap(false);
    }

    const fetchDistance = async () => {
      if (!originStay || !destinationStay) return;

      try {
        setIsLoading(true);
        setError(null);

        const origin = encodeURIComponent(originStay.address);
        const destination = encodeURIComponent(destinationStay.address);

        const response = await fetch(`/api/distance?origin=${origin}&destination=${destination}`);

        if (!response.ok) {
          throw new Error('Failed to fetch distance data');
        }

        const data = await response.json();
        setDistanceData(data);
      } catch (err) {
        console.error('Error fetching distance:', err);
        setError(err instanceof Error ? err.message : 'Failed to calculate distance');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch distance if there's no gap
    if (!hasGap) {
      fetchDistance();
    }
  }, [originStay, destinationStay, hasGap]);

  // Display a gap indicator instead of distance
  if (hasGap) {
    const originDepartureDate = new Date(originStay.departureDate);
    const destinationArrivalDate = new Date(destinationStay.arrivalDate);
    const gapInMs = destinationArrivalDate.getTime() - originDepartureDate.getTime();
    const gapInDays = Math.floor(gapInMs / (1000 * 60 * 60 * 24));

    const handleGapClick = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      // Functionality will be added later
      console.log('Add a new stay in the gap between', originStay.location, 'and', destinationStay.location);
    };

    return <GapIndicator gapInDays={gapInDays} onClick={handleGapClick} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="loading loading-dots loading-sm"></div>
      </div>
    );
  }

  if (error || (distanceData && distanceData.error)) {
    return (
      <div className="py-4 text-center text-sm text-error">
        <span>Unable to calculate travel distance</span>
      </div>
    );
  }

  if (!distanceData) return null;

  const getGoogleMapsUrl = () => {
    const origin = encodeURIComponent(originStay.address);
    const destination = encodeURIComponent(destinationStay.address);
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  };

  const handleMapsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getGoogleMapsUrl(), '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.open(getGoogleMapsUrl(), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2">
      <DashedConnector height={8} spacing="mb-2" />

      <button
        className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-base-100/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:shadow-md hover:from-primary/15 hover:to-base-100/90 transition-all duration-300 ring-1 ring-base-300 hover:ring-primary/30"
        onClick={handleMapsClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label={`View route from ${originStay.location} to ${destinationStay.location} on Google Maps`}
        role="link"
      >
        <CarFront className="h-5 w-5 text-primary" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{distanceData.distance}</span>
            <ExternalLink className="h-3 w-3 text-gray-500" />
          </div>
          <span className="text-xs text-gray-500">{distanceData.duration}</span>
        </div>
      </button>

      <DashedConnector height={8} spacing="mt-2" />
    </div>
  );
};

export default StayDistance;
