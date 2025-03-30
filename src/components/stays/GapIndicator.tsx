'use client';

import { RouteOff, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashedConnector from '../ui/DashedConnector';

interface GapIndicatorProps {
  gapInDays: number;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

const GapIndicator = ({ gapInDays, onClick }: GapIndicatorProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  // Animation will run once on mount, then stop after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const handleAddStay = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else {
      // Default action if no callback provided
      // Handle adding a new stay in the gap
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAddStay(e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 w-full max-w-3xl mx-auto">
      <DashedConnector height={6} color="warning" opacity={60} spacing="mb-2" />

      <div className="card bg-gradient-to-r from-warning/5 to-base-100 shadow-sm w-full rounded-xl ring-1 ring-warning/30 hover:shadow-md transition-all duration-300">
        <div className="card-body p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`relative ${isAnimating ? 'animate-pulse' : ''}`}>
              <RouteOff className="h-6 w-6 text-warning flex-shrink-0" />
              <div className="absolute inset-0 rounded-full bg-warning/10"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold">{gapInDays}-day gap</span>
              <span className="text-xs font-medium text-gray-600">Unplanned period between stays</span>
            </div>
          </div>

          <button
            className="flex items-center justify-center bg-primary text-primary-content rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={(e) => handleAddStay(e)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            aria-label="Add a new stay"
            role="button"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <DashedConnector height={6} color="warning" opacity={60} spacing="mt-2" />
    </div>
  );
};

export default GapIndicator;
