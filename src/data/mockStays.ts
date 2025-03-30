import { Stay } from '../types';

const mockStays: Stay[] = [
  {
    id: '1',
    location: 'Brighton',
    address: '24 Kings Road, Brighton BN1 2HJ, UK',
    arrivalDate: '2025-04-05T14:00:00Z',
    departureDate: '2025-04-10T11:00:00Z',
    arrivalNotes: 'Check-in at the reception desk. Code for key box: 4578',
    departureNotes: 'Leave keys on the kitchen counter. Checkout by 11:00 AM.'
  },
  {
    id: '2',
    location: 'London',
    address: '10 Wardour Street, London W1D 6QF, UK',
    arrivalDate: '2025-04-10T15:00:00Z',
    departureDate: '2025-04-17T10:00:00Z',
    notes: 'Central London flat walking distance to Piccadilly Circus and theaters',
    arrivalNotes: 'Host will meet you at the flat. Call +44 7700 900123 when you arrive.',
    departureNotes: 'Turn off all appliances and lock the door when leaving.'
  },
  // One-week gap
  {
    id: '3',
    location: 'Oxford',
    address: '52 High Street, Oxford OX1 4AS, UK',
    arrivalDate: '2025-04-24T12:00:00Z',
    departureDate: '2025-04-28T10:00:00Z',
    notes: 'Charming cottage near Oxford University'
  },
  {
    id: '4',
    location: 'Cotswolds',
    address: '5 Arlington Row, Bibury GL7 5NJ, UK',
    arrivalDate: '2025-04-28T15:00:00Z',
    departureDate: '2025-05-02T11:00:00Z',
    notes: 'Traditional stone cottage in picturesque Cotswolds village'
  },
  {
    id: '5',
    location: 'Manchester',
    address: '15 Deansgate, Manchester M3 2EY, UK',
    arrivalDate: '2025-05-02T16:00:00Z',
    departureDate: '2025-05-06T10:00:00Z',
    notes: 'Modern apartment in converted industrial building near city center'
  },
  // One-week gap
  {
    id: '6',
    location: 'Edinburgh',
    address: '24 Royal Mile, Edinburgh EH1 1TG, UK',
    arrivalDate: '2025-05-13T13:00:00Z',
    departureDate: '2025-05-19T10:00:00Z',
    notes: 'Historic apartment with views of Edinburgh Castle'
  },
  {
    id: '7',
    location: 'Scottish Highlands',
    address: '8 Castle Street, Inverness IV2 3DU, UK',
    arrivalDate: '2025-05-19T15:00:00Z',
    departureDate: '2025-05-23T11:00:00Z',
    notes: 'Cozy cottage near Loch Ness with stunning Highland views'
  },
  // One-week gap
  {
    id: '8',
    location: 'Paris',
    address: '15 Rue de Rivoli, 75004 Paris, France',
    arrivalDate: '2025-05-30T12:00:00Z',
    departureDate: '2025-06-05T10:00:00Z',
    notes: 'Elegant apartment near Le Marais with Eiffel Tower view from balcony'
  },
  {
    id: '9',
    location: 'Bordeaux',
    address: '25 Quai des Chartrons, 33000 Bordeaux, France',
    arrivalDate: '2025-06-05T14:00:00Z',
    departureDate: '2025-06-09T11:00:00Z',
    notes: 'Renovated apartment in historic wine district with vineyard tour options'
  },
  {
    id: '10',
    location: 'Barcelona',
    address: 'Carrer de Mallorca, 401, 08013 Barcelona, Spain',
    arrivalDate: '2025-06-09T16:00:00Z',
    departureDate: '2025-06-16T11:00:00Z',
    notes: 'Modern apartment near Sagrada Familia with rooftop pool'
  }
];

export default mockStays;
