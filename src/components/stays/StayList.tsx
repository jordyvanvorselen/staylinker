'use client';

import { useEffect, useState } from 'react';
import { Stay } from '../../types';
import StayCard from './StayCard';
import StayDistance from './StayDistance';
import AddStayPrompt from './AddStayPrompt';
import { Plus } from 'lucide-react';

const StayList = () => {
  const [stays, setStays] = useState<Stay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for selected stay will be implemented when detail functionality is added

  const fetchStays = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stays');

      if (!response.ok) {
        throw new Error('Failed to fetch stays');
      }

      const data = await response.json();

      // Sort stays by arrival date
      const sortedStays = [...data].sort(
        (a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime(),
      );

      setStays(sortedStays);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStays();
  }, []);

  const handleStayClick = (stay: Stay) => {
    // Will implement selected stay functionality in a future update
    console.log('Stay clicked:', stay.id);
    // Functionality for opening a modal or navigating to a detail page will be added here
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading stays: {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {stays.length === 0 ? (
        <div className="card bg-base-100 shadow p-6 text-center">
          <h3 className="font-medium text-lg mb-2">No stays found</h3>
          <p className="text-gray-600">Plan your first trip by adding a stay!</p>
          <div className="mt-4 flex justify-center">
            <button 
              className="flex items-center justify-center bg-primary text-primary-content rounded-full p-3 shadow-sm hover:shadow-md transition-all duration-200"
              aria-label="Add a new stay"
              role="button"
              onClick={() => console.log('Add new stay clicked')}
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-3xl mx-auto">
          {/* Display all stays with distances between them */}
          {stays.map((stay, index) => (
            <div key={stay.id} className="mb-2">
              <StayCard stay={stay} onClick={handleStayClick} />

              {/* Show distance to next stay if there is one */}
              {index < stays.length - 1 && stays[index + 1] && (
                <StayDistance originStay={stay} destinationStay={stays[index + 1]!} />
              )}
            </div>
          ))}
          
          {/* Add the 'Add New Stay' prompt at the end of the timeline */}
          <div className="mb-2">
            <AddStayPrompt onClick={() => console.log('Add new stay from timeline end')} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StayList;
