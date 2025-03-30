'use client';

import { useState } from 'react';
import { Stay } from '../../types';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface StayCardProps {
  stay: Stay;
  onClick?: (stay: Stay) => void;
}

const StayCard = ({ stay, onClick }: StayCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(stay);
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

  const dayCount = Math.ceil(
    (new Date(stay.departureDate).getTime() - new Date(stay.arrivalDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <div
      className="card bg-base-200/30 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden rounded-xl ring-1 ring-base-300 hover:ring-primary/30"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`Stay at ${stay.location}`}
      role="button"
    >
      {/* Arrival Section at Top */}
      <div className="bg-gradient-to-br from-accent/20 via-accent/5 to-base-200/30 py-3 px-6 flex flex-col items-center border-b border-base-300/20">
        <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">Arrival</span>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-4 w-4 text-accent" />
          <span className="font-medium text-md">{formatDate(stay.arrivalDate)}</span>
        </div>

        {stay.arrivalNotes && (
          <div className="mt-2 w-full px-2">
            <p className="text-xs text-left text-gray-500 italic">{stay.arrivalNotes}</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="card-body p-6 bg-base-200/10">
        <div className="flex flex-col items-center mb-3">
          <h2 className="card-title text-xl font-bold text-center mb-1">{stay.location}</h2>
          <p className="text-sm text-gray-600 text-center">{stay.address}</p>
          <div className="badge badge-primary badge-lg mt-3 opacity-80">
            {dayCount} {dayCount === 1 ? 'day' : 'days'}
          </div>
        </div>

        {stay.notes && (
          <div className="mt-4 px-2">
            <p className={`text-xs text-gray-500 italic ${isExpanded ? '' : 'line-clamp-2'}`}>{stay.notes}</p>
            {stay.notes.length > 80 && (
              <button
                className="text-xs text-accent hover:text-accent-focus mt-1"
                onClick={e => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                aria-expanded={isExpanded}
                aria-controls="notes-content"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Departure Section at Bottom */}
      <div className="bg-gradient-to-tr from-primary/20 via-primary/5 to-base-200/30 py-3 px-6 flex flex-col items-center border-t border-base-300/20">
        <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">Departure</span>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium text-md">{formatDate(stay.departureDate)}</span>
        </div>

        {stay.departureNotes && (
          <div className="mt-2 w-full px-2">
            <p className="text-xs text-left text-gray-500 italic">{stay.departureNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StayCard;
