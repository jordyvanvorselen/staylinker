'use client';

import { Clock } from 'lucide-react';

interface TimeConstraintWarningProps {
  isViolated: boolean;
}

const TimeConstraintWarning = ({ isViolated }: TimeConstraintWarningProps) => {
  if (!isViolated) return null;

  return (
    <div className="w-full flex flex-col items-center mb-2">
      <div className="flex items-center gap-2 text-error text-xs font-medium bg-error/10 rounded-full px-3 py-1 shadow-sm">
        <Clock className="h-4 w-4" />
        <span>Drive time exceeds available time window</span>
      </div>
    </div>
  );
};

export default TimeConstraintWarning;
