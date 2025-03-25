export interface Stay {
  id: string;
  location: string; // City/village name
  address: string;
  arrivalDate: string; // ISO string format
  departureDate: string; // ISO string format
  notes?: string; // Optional field for additional information
}
