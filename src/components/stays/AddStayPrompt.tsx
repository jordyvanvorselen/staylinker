'use client';

import { Plus } from 'lucide-react';
import DashedConnector from '../ui/DashedConnector';

interface AddStayPromptProps {
  onClick?: () => void;
}

const AddStayPrompt = ({ onClick }: AddStayPromptProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      // Default action if no callback provided
      console.log('Add a new stay prompted');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as unknown as React.MouseEvent);
    }
  };

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

          <button
            className="flex items-center justify-center bg-primary text-primary-content rounded-full p-2 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            aria-label="Add a new stay"
            role="button"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStayPrompt;
