import { Stay } from '../types';

const mockStays: Stay[] = [
  {
    id: '1',
    location: 'Amsterdam',
    address: 'Prinsengracht 263, 1016 GV Amsterdam',
    arrivalDate: '2025-04-15T14:00:00Z',
    departureDate: '2025-04-18T11:00:00Z',
    notes: 'Beautiful canal view apartment with bike rental nearby'
  },
  {
    id: '2',
    location: 'Paris',
    address: '1 Rue de la Paix, 75002 Paris, France',
    arrivalDate: '2025-05-10T15:00:00Z',
    departureDate: '2025-05-15T10:00:00Z',
    notes: 'Charming studio near Louvre Museum'
  },
  {
    id: '3',
    location: 'Barcelona',
    address: 'Carrer de Mallorca, 401, 08013 Barcelona, Spain',
    arrivalDate: '2025-06-20T16:00:00Z',
    departureDate: '2025-06-27T12:00:00Z',
    notes: 'Modern apartment close to Sagrada Familia'
  }
];

export default mockStays;
