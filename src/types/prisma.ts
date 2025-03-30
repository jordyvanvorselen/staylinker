import { Stay as PrismaStay, Trip as PrismaTrip } from '@prisma/client';

// Export the Prisma types directly 
export type Stay = PrismaStay;
export type Trip = PrismaTrip;

// Extended types for when we need relations included
export interface TripWithStays extends PrismaTrip {
  stays: PrismaStay[];
}

// Types for creating and updating entities
export type StayCreateInput = Omit<PrismaStay, 'id' | 'createdAt' | 'updatedAt'>;
export type StayUpdateInput = Partial<Omit<PrismaStay, 'id' | 'createdAt' | 'updatedAt' | 'tripId'>>;

export type TripCreateInput = Omit<PrismaTrip, 'id' | 'createdAt' | 'updatedAt'>;
export type TripUpdateInput = Partial<Omit<PrismaTrip, 'id' | 'createdAt' | 'updatedAt'>>;
