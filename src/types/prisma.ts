// Type definitions for Prisma models

// Define the Stay type based on Prisma schema
export interface Stay {
  id: string;
  location: string;
  address: string;
  arrivalDate: Date;
  departureDate: Date;
  notes?: string | null;
  arrivalNotes?: string | null;
  departureNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  tripId: string;
}

// Define the Trip type based on Prisma schema
export interface Trip {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Extended types for when we need relations included
export interface TripWithStays extends Trip {
  stays: Stay[];
}

// Types for creating and updating entities
export type StayCreateInput = Omit<Stay, 'id' | 'createdAt' | 'updatedAt'>;
export type StayUpdateInput = Partial<Omit<Stay, 'id' | 'createdAt' | 'updatedAt' | 'tripId'>>;

export type TripCreateInput = Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
export type TripUpdateInput = Partial<Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>;

// Auth user type
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  trips?: Trip[];
}
