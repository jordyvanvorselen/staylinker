'use client';

import { Plus } from 'lucide-react';
import DashedConnector from '../ui/DashedConnector';
import Link from 'next/link';

interface AddStayPromptProps {
  tripId: string;
}

const AddStayPrompt = ({ tripId }: AddStayPromptProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 w-full max-w-3xl mx-auto">
      <DashedConnector height={10} spacing="mb-4" />

      <div className="card bg-base-100 shadow-sm w-full rounded-xl ring-1 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
        <div className="card-body p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-400"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold">Add your next adventure</span>
              <span className="text-xs text-gray-500">Continue your journey with a new stay</span>
            </div>
          </div>

          <Link
            href={`/trips/${tripId}/stays/new`}
            className="flex items-center justify-center bg-primary text-primary-content rounded-full p-2 shadow-sm hover:shadow-md active:shadow-inner active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-2"
            tabIndex={0}
            aria-label="Add a new stay"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddStayPrompt;
