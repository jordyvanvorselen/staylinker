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

export interface Trip {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  stays?: Stay[]; // A trip can have multiple stays
}
