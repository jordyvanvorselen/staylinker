'use client';

import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface TravelDateSectionProps {
  type: 'arrival' | 'departure';
  date: string;
  time?: string | undefined;
  confirmed?: boolean | undefined;
  notes?: string | undefined;
  formatDate: (_date: string) => string;
  formatTime: (_time?: string | undefined) => string | null;
}

const TravelDateSection = ({
  type,
  date,
  time,
  confirmed,
  notes,
  formatDate,
  formatTime,
}: TravelDateSectionProps) => {
  const isArrival = type === 'arrival';
  const gradientClasses = isArrival
    ? 'bg-gradient-to-br from-accent/20 via-accent/5 to-base-200/30'
    : 'bg-gradient-to-tr from-primary/20 via-primary/5 to-base-200/30';
  const iconColor = isArrival ? 'text-accent' : 'text-primary';
  const label = isArrival ? 'Arrival' : 'Departure';

  return (
    <div
      className={`${gradientClasses} pt-3 pb-4 px-6 flex flex-col items-center ${isArrival ? 'border-b' : 'border-t'} border-base-300/20 relative`}
    >
      <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</span>

      {/* Date and confirmation status */}
      <div className="flex items-center gap-2 mb-3">
        <Calendar className={`h-4 w-4 ${iconColor}`} />
        <span className="font-medium text-md">
          {formatDate(date)}
          {time && <span> • {formatTime(time)}</span>}
        </span>
        {confirmed ? (
          <CheckCircle className="h-4 w-4 text-green-500 ml-1" aria-label={`${label} confirmed`} />
        ) : (
          <AlertCircle
            className="h-4 w-4 text-orange-400 opacity-60 ml-1"
            aria-label={`${label} not confirmed yet`}
          />
        )}
      </div>

      {notes && (
        <div className="mt-1 w-full px-2">
          <p className="text-xs text-left text-gray-500 italic">{notes}</p>
        </div>
      )}
    </div>
  );
};

export default TravelDateSection;
