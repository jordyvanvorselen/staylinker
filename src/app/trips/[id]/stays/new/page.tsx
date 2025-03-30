'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Save } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function NewStayPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params['id'] as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // Multi-step form
  const [formData, setFormData] = useState({
    location: '',
    address: '',
    arrivalDate: new Date(),
    departureDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Default to tomorrow
    arrivalNotes: '',
    departureNotes: '',
    notes: ''
  });

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date changes
  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [name]: date
      }));
      
      // If arrival date changes and it's later than departure, update departure
      if (name === 'arrivalDate' && date > formData.departureDate) {
        // Set departure to arrival + 1 day
        const newDeparture = new Date(date);
        newDeparture.setDate(date.getDate() + 1);
        setFormData(prev => ({
          ...prev,
          departureDate: newDeparture
        }));
      }
    }
  };

  // Go to next step
  const nextStep = () => {
    // Basic validation for Step 1
    if (step === 1) {
      if (!formData.location.trim()) {
        setError('Location is required');
        return;
      }
      if (!formData.address.trim()) {
        setError('Address is required');
        return;
      }
    }
    
    setError(null);
    setStep(prev => prev + 1);
  };

  // Go to previous step
  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.location.trim() || !formData.address.trim()) {
      setError('Location and address are required');
      setStep(1); // Go back to first step
      return;
    }
    
    if (formData.arrivalDate >= formData.departureDate) {
      setError('Departure date must be after arrival date');
      setStep(2); // Go to dates step
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch(`/api/trips/${tripId}/stays`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create stay');
      }
      
      // Redirect to trip detail page
      router.push(`/trips/${tripId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <Link 
          href={`/trips/${tripId}`}
          className="btn btn-ghost btn-sm gap-2 hover:bg-base-200 active:bg-base-300 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-base-300"
          aria-label="Back to trip"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trip
        </Link>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">Add New Stay</h1>
          
          {/* Progress steps */}
          <ul className="steps w-full mb-8">
            <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Location</li>
            <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Dates</li>
            <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Details</li>
          </ul>
          
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Location */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="form-control w-full">
                  <label className="label" htmlFor="location">
                    <span className="label-text font-medium">Location Name</span>
                    <span className="label-text-alt text-error">Required</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Paris Apartment"
                      className="input input-bordered w-full pl-10"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>
                
                <div className="form-control w-full">
                  <label className="label" htmlFor="address">
                    <span className="label-text font-medium">Address</span>
                    <span className="label-text-alt text-error">Required</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Full address of your stay"
                    className="textarea textarea-bordered h-20 w-full"
                    required
                    aria-required="true"
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    className="btn btn-primary hover:shadow-md active:shadow-inner active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-1"
                    onClick={nextStep}
                  >
                    Next: Select Dates
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Dates */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control w-full">
                    <label className="label" htmlFor="arrivalDate">
                      <span className="label-text font-medium">Arrival Date</span>
                      <span className="label-text-alt text-error">Required</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                        <Calendar className="h-5 w-5 text-accent" />
                      </span>
                      <DatePicker
                        selected={formData.arrivalDate}
                        onChange={(date: Date | null) => handleDateChange('arrivalDate', date)}
                        className="input input-bordered w-full pl-10"
                        dateFormat="MMMM d, yyyy"
                        required
                        id="arrivalDate"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="label" htmlFor="arrivalNotes">
                        <span className="label-text">Arrival Notes (Optional)</span>
                      </label>
                      <textarea
                        id="arrivalNotes"
                        name="arrivalNotes"
                        value={formData.arrivalNotes}
                        onChange={handleInputChange}
                        placeholder="e.g., Check-in time, key location"
                        className="textarea textarea-bordered h-16 w-full text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="form-control w-full">
                    <label className="label" htmlFor="departureDate">
                      <span className="label-text font-medium">Departure Date</span>
                      <span className="label-text-alt text-error">Required</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </span>
                      <DatePicker
                        selected={formData.departureDate}
                        onChange={(date: Date | null) => handleDateChange('departureDate', date)}
                        className="input input-bordered w-full pl-10"
                        dateFormat="MMMM d, yyyy"
                        minDate={new Date(formData.arrivalDate.getTime() + 86400000)} // Next day
                        required
                        id="departureDate"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="label" htmlFor="departureNotes">
                        <span className="label-text">Departure Notes (Optional)</span>
                      </label>
                      <textarea
                        id="departureNotes"
                        name="departureNotes"
                        value={formData.departureNotes}
                        onChange={handleInputChange}
                        placeholder="e.g., Check-out time, key drop-off"
                        className="textarea textarea-bordered h-16 w-full text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="btn btn-outline hover:shadow-sm active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-base-300"
                    onClick={prevStep}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary hover:shadow-md active:shadow-inner active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-1"
                    onClick={nextStep}
                  >
                    Next: Add Details
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Stay Notes */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="form-control w-full">
                  <label className="label" htmlFor="notes">
                    <span className="label-text font-medium">Stay Notes</span>
                    <span className="label-text-alt">Optional</span>
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any additional notes about this stay..."
                    className="textarea textarea-bordered h-48 w-full"
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="btn btn-outline hover:shadow-sm active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-base-300"
                    onClick={prevStep}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary gap-2 hover:shadow-md active:shadow-inner active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create Stay
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
