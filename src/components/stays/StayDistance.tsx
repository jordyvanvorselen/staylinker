'use client';

import { useEffect, useState } from 'react';
import { Stay } from '../../types';
import { AlertCircle, ArrowRight, Plus, ExternalLink } from 'lucide-react';

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

    const handleAddStay = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      // Functionality will be added later
      console.log('Add a new stay in the gap');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleAddStay(e);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center py-4 px-2 w-full max-w-3xl mx-auto">
        {/* Vertical dashed line above gap indicator */}
        <div className="h-6 border-l-2 border-dashed border-warning opacity-60 mb-2"></div>

        <div className="card bg-base-100 shadow-sm w-full rounded-xl ring-1 ring-warning/30">
          <div className="card-body p-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-warning flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-base font-semibold">{gapInDays}-day gap</span>
                <span className="text-xs text-gray-500">Unplanned period between stays</span>
              </div>
            </div>

            <button
              className="flex items-center justify-center bg-primary text-primary-content rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={handleAddStay}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              aria-label="Add a new stay"
              role="button"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Vertical dashed line below gap indicator */}
        <div className="h-6 border-l-2 border-dashed border-warning opacity-60 mt-2"></div>
      </div>
    );
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
      {/* Vertical dashed line above distance indicator */}
      <div className="h-8 border-l-2 border-dashed border-gray-300 opacity-70 mb-2"></div>

      <button
        className="flex items-center gap-2 bg-base-100/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:bg-base-100 transition-colors ring-1 ring-base-300"
        onClick={handleMapsClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label={`View route from ${originStay.location} to ${destinationStay.location} on Google Maps`}
        role="link"
      >
        <ArrowRight className="h-5 w-5 text-primary" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{distanceData.distance}</span>
            <ExternalLink className="h-3 w-3 text-gray-500" />
          </div>
          <span className="text-xs text-gray-500">{distanceData.duration}</span>
        </div>
      </button>

      {/* Vertical dashed line below distance indicator */}
      <div className="h-8 border-l-2 border-dashed border-gray-300 opacity-70 mt-2"></div>
    </div>
  );
};

export default StayDistance;
