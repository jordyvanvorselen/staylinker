'use client';

import { useState } from 'react';
import { Stay } from '../../types';
import { format } from 'date-fns';
import { Edit, Phone, User } from 'lucide-react';
import Link from 'next/link';
import TravelDateSection from './TravelDateSection';

interface StayCardProps {
  stay: Stay;
  onClick?: (_stay: Stay) => void;
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

  const formatTime = (timeString?: string) => {
    if (!timeString) return null;

    try {
      // Parse HH:MM format
      const [hoursStr, minutesStr] = timeString.split(':');
      if (!hoursStr || !minutesStr) return timeString;

      const hours = Number(hoursStr);
      const minutes = Number(minutesStr);

      if (isNaN(hours) || isNaN(minutes)) return timeString;

      // Create a date object to format the time
      const date = new Date();
      date.setHours(hours, minutes, 0);

      // Format as localized time (e.g., "3:30 PM")
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (_error) {
      return timeString; // Fallback to original string if parsing fails
    }
  };

  const dayCount = Math.ceil(
    (new Date(stay.departureDate).getTime() - new Date(stay.arrivalDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <div
      className="card bg-base-200/30 shadow-md hover:shadow-xl active:shadow-sm transition-all duration-300 cursor-pointer overflow-hidden rounded-xl ring-1 ring-base-300 hover:ring-primary/30 active:ring-primary/50 hover:translate-y-[-2px] active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-primary/40 relative"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`Stay at ${stay.location}`}
      role="button"
    >
      {/* Edit Button - Positioned absolutely to avoid affecting the card click */}
      <div
        className="absolute top-2 right-2 z-10"
        onClick={(e) => e.stopPropagation()} // Prevent card click when edit button is clicked
      >
        <Link
          href={`/trips/${stay.tripId}/stays/${stay.id}/edit`}
          className="btn btn-circle btn-sm btn-ghost hover:bg-base-300"
          aria-label={`Edit stay at ${stay.location}`}
          tabIndex={0}
        >
          <Edit className="h-4 w-4" />
        </Link>
      </div>

      {/* Arrival Section at Top */}
      <TravelDateSection
        type="arrival"
        date={stay.arrivalDate}
        time={stay.arrivalTime}
        confirmed={stay.arrivalConfirmed}
        notes={stay.arrivalNotes}
        formatDate={formatDate}
        formatTime={formatTime}
      />

      {/* Main Content */}
      <div className="card-body p-6 bg-base-200/10">
        <div className="flex flex-col items-center mb-3">
          <h2 className="card-title text-xl font-bold text-center mb-1">{stay.location}</h2>
          <p className="text-sm text-gray-600 text-center">{stay.address}</p>
          <div className="badge badge-primary badge-lg mt-4 py-3 px-4 text-sm font-semibold shadow-sm">
            {dayCount} {dayCount === 1 ? 'day' : 'days'}
          </div>
        </div>

        {/* Contacts Section */}
        {stay.contacts && stay.contacts.length > 0 && (
          <div className="mt-3 mb-2">
            <div className="divider text-xs text-gray-500 my-1">Contacts</div>
            <div className="flex flex-wrap justify-center gap-2 py-3">
              {stay.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center bg-base-100 rounded-full px-3 py-1.5 shadow-sm border border-base-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <User className="h-4 w-4 text-primary mr-2" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{contact.name}</span>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-xs text-primary flex items-center hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm"
                      onClick={(e) => e.stopPropagation()}
                      tabIndex={0}
                      aria-label={`Call ${contact.name} at ${contact.phone}`}
                    >
                      <Phone className="h-2.5 w-2.5 mr-1" />
                      {contact.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stay.notes && (
          <div className="px-2">
            <div className="divider text-xs text-gray-500 my-1">Notes</div>
            <div className="py-3">
              <p className={`text-xs text-gray-500 italic ${isExpanded ? '' : 'line-clamp-2'}`}>
                {stay.notes}
              </p>
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
          </div>
        )}
      </div>

      {/* Departure Section at Bottom */}
      <TravelDateSection
        type="departure"
        date={stay.departureDate}
        time={stay.departureTime}
        confirmed={stay.departureConfirmed}
        notes={stay.departureNotes}
        formatDate={formatDate}
        formatTime={formatTime}
      />
    </div>
  );
};

export default StayCard;
