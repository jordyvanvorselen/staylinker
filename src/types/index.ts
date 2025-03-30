export interface Stay {
  id: string;
  location: string; // City/village name
  address: string;
  arrivalDate: string; // ISO string format
  departureDate: string; // ISO string format
  notes?: string; // Optional field for general information
  arrivalNotes?: string; // Optional notes specific to arrival
  departureNotes?: string; // Optional notes specific to departure
  tripId?: string; // Reference to the parent trip
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export interface TripUser {
  user: User;
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner?: User;
  users?: TripUser[]; // Users who have access to this trip
  stays?: Stay[]; // A trip can have multiple stays
}
