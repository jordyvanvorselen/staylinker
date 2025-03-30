'use client';

import { useEffect, useState } from 'react';
import { Stay } from '../../types';
import StayCard from './StayCard';
import StayDistance from './StayDistance';

const StayList = () => {
  const [stays, setStays] = useState<Stay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);

  const fetchStays = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stays');
      
      if (!response.ok) {
        throw new Error('Failed to fetch stays');
      }
      
      const data = await response.json();
      
      // Sort stays by arrival date
      const sortedStays = [...data].sort((a, b) => 
        new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime()
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
    setSelectedStay(stay);
    // You can implement additional functionality here, such as opening a modal or navigating to a detail page
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
      <h2 className="text-2xl font-bold mb-4">Stays</h2>
      {stays.length === 0 ? (
        <div className="card bg-base-100 shadow p-6 text-center">
          <h3 className="font-medium text-lg mb-2">No stays found</h3>
          <p className="text-gray-600">Plan your first trip by adding a stay!</p>
          <div className="mt-4">
            <button className="btn btn-primary">Add Stay</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-3xl mx-auto">
          {stays.map((stay, index) => (
            <div key={stay.id} className="mb-2">
              <StayCard 
                stay={stay} 
                onClick={handleStayClick}
              />
              
              {/* Show distance to next stay if there is one */}
              {index < stays.length - 1 && stays[index + 1] && (
                <StayDistance 
                  originStay={stay} 
                  destinationStay={stays[index + 1]!} 
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StayList;
