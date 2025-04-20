'use client';

import { useEffect, useState } from 'react';
import { Stay } from '../../types';
import { CarFront, ExternalLink, AlertTriangle } from 'lucide-react';
import DashedConnector from '../ui/DashedConnector';
import GapIndicator from './GapIndicator';
import TimeConstraintWarning from './TimeConstraintWarning';

interface StayDistanceProps {
  originStay: Stay;
  destinationStay: Stay;
}

interface DistanceData {
  distance: string;
  duration: string;
  durationInSeconds: number;
  routeFound: boolean;
  error?: string;
}

const StayDistance = ({ originStay, destinationStay }: StayDistanceProps) => {
  const [distanceData, setDistanceData] = useState<DistanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGap, setHasGap] = useState(false);
  const [timeConstraintViolated, setTimeConstraintViolated] = useState(false);

  // Check if there's a gap between stays on component mount
  useEffect(() => {
    const checkGapBetweenStays = () => {
      const originDepartureDate = new Date(originStay.departureDate);
      const destinationArrivalDate = new Date(destinationStay.arrivalDate);

      // Calculate gap in milliseconds and convert to days
      const gapInMs = destinationArrivalDate.getTime() - originDepartureDate.getTime();
      const gapInDays = gapInMs / (1000 * 60 * 60 * 24);

      // If gap is more than 2 days, we don't calculate distance
      return gapInDays > 2;
    };

    setHasGap(checkGapBetweenStays());
  }, [originStay.departureDate, destinationStay.arrivalDate]);

  // Fetch distance data if no gap exists
  useEffect(() => {
    if (hasGap) return;

    // Define checkTimeConstraint inside the useEffect to fix the dependency warning
    const checkTimeConstraint = (data: DistanceData) => {
      // Early return if missing necessary data
      if (!data.routeFound || !originStay.departureTime || !destinationStay.arrivalTime) {
        setTimeConstraintViolated(false);
        return;
      }

      // Parse time strings into date objects with safe type handling
      const parseDateWithTime = (dateStr: string, timeStr: string) => {
        // Safely parse hours and minutes, defaulting to 0 if undefined
        const parts = timeStr.split(':');
        const hours = parts[0] ? parseInt(parts[0], 10) || 0 : 0;
        const minutes = parts[1] ? parseInt(parts[1], 10) || 0 : 0;

        const date = new Date(dateStr);
        date.setHours(hours, minutes, 0, 0);
        return date;
      };

      const departureDate = parseDateWithTime(originStay.departureDate, originStay.departureTime);
      const arrivalDate = parseDateWithTime(
        destinationStay.arrivalDate,
        destinationStay.arrivalTime,
      );

      // Calculate available time in seconds
      const availableTimeInSeconds = (arrivalDate.getTime() - departureDate.getTime()) / 1000;

      // Check if drive time exceeds available time
      setTimeConstraintViolated(data.durationInSeconds > availableTimeInSeconds);
    };

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

        // Check time constraint once we have the data
        checkTimeConstraint(data);
      } catch (err) {
        console.error('Error fetching distance:', err);
        setError(err instanceof Error ? err.message : 'Failed to calculate distance');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDistance();
  }, [originStay, destinationStay, hasGap]);

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

  // Display a gap indicator instead of distance
  if (hasGap) {
    const originDepartureDate = new Date(originStay.departureDate);
    const destinationArrivalDate = new Date(destinationStay.arrivalDate);
    const gapInMs = destinationArrivalDate.getTime() - originDepartureDate.getTime();
    const gapInDays = Math.floor(gapInMs / (1000 * 60 * 60 * 24));

    const handleGapClick = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      // Functionality will be added later
      // Handle adding a new stay in the gap
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

  // Handle network/API errors
  if (error && !distanceData) {
    return (
      <div className="py-4 text-center text-sm text-error">
        <span>Unable to calculate travel distance</span>
      </div>
    );
  }

  if (!distanceData) return null;

  // Calculate button styles based on status
  const getButtonStyles = () => {
    if (!distanceData.routeFound) {
      return 'bg-gradient-to-r from-warning/10 to-base-100/80 ring-warning/30 hover:ring-warning/50 hover:from-warning/15 hover:to-base-100/90';
    }

    if (timeConstraintViolated) {
      return 'bg-gradient-to-r from-error/10 to-base-100/80 ring-error/30 hover:ring-error/50 hover:from-error/15 hover:to-base-100/90';
    }

    return 'bg-gradient-to-r from-primary/10 to-base-100/80 ring-base-300 hover:ring-primary/30 hover:from-primary/15 hover:to-base-100/90';
  };

  // Get appropriate icon based on status
  const getStatusIcon = () => {
    if (!distanceData.routeFound) {
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    }

    if (timeConstraintViolated) {
      return <AlertTriangle className="h-5 w-5 text-error" />;
    }

    return <CarFront className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2">
      <DashedConnector height={8} spacing="mb-2" />

      <div className="flex flex-col items-center">
        <TimeConstraintWarning isViolated={timeConstraintViolated} />

        <button
          className={`flex items-center gap-2 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 ring-1 ${getButtonStyles()}`}
          onClick={handleMapsClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label={`View route from ${originStay.location} to ${destinationStay.location} on Google Maps`}
          role="link"
        >
          {getStatusIcon()}

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{distanceData.distance}</span>
              <ExternalLink className="h-3 w-3 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">
              {distanceData.routeFound
                ? distanceData.duration
                : 'No direct route found - Check Google Maps'}
            </span>
          </div>
        </button>
      </div>

      <DashedConnector height={8} spacing="mt-2" />
    </div>
  );
};

export default StayDistance;
