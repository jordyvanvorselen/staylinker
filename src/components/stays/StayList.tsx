'use client';

import { useEffect, useState } from 'react';
import { Stay } from '../../types';

const StayList = () => {
  const [stays, setStays] = useState<Stay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStays = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stays');
      
      if (!response.ok) {
        throw new Error('Failed to fetch stays');
      }
      
      const data = await response.json();
      setStays(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStays();
  }, []);

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
        <div className="p-4 border rounded">
          <p>No stays found. Plan your first trip!</p>
        </div>
      ) : (
        <div className="p-4 border rounded">
          <p className="mb-2">Found {stays.length} stays.</p>
          <p className="text-sm text-gray-500">UI visualization will be implemented later.</p>
        </div>
      )}
    </div>
  );
};

export default StayList;
