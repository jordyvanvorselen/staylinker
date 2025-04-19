'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Save, Trash2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function EditStayPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params['id'] as string;
  const stayId = params['stayId'] as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // Multi-step form
  const [formData, setFormData] = useState({
    location: '',
    address: '',
    arrivalDate: new Date(),
    departureDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    arrivalNotes: '',
    departureNotes: '',
    notes: '',
  });
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch existing stay data
  useEffect(() => {
    const fetchStay = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/trips/${tripId}/stays/${stayId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch stay details');
        }

        const data = await response.json();
        
        setFormData({
          location: data.location,
          address: data.address,
          arrivalDate: new Date(data.arrivalDate),
          departureDate: new Date(data.departureDate),
          arrivalNotes: data.arrivalNotes || '',
          departureNotes: data.departureNotes || '',
          notes: data.notes || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId && stayId) {
      fetchStay();
    }
  }, [tripId, stayId]);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date changes
  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [name]: date,
      }));

      // If arrival date changes and it's later than departure, update departure
      if (name === 'arrivalDate' && date > formData.departureDate) {
        // Set departure to arrival + 1 day
        const newDeparture = new Date(date);
        newDeparture.setDate(date.getDate() + 1);
        setFormData(prev => ({
          ...prev,
          departureDate: newDeparture,
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

      const response = await fetch(`/api/trips/${tripId}/stays/${stayId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update stay');
      }

      // Redirect to trip detail page
      router.push(`/trips/${tripId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/trips/${tripId}/stays/${stayId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete stay');
      }

      // Close modal and redirect to trip detail page
      setIsDeleteModalOpen(false);
      router.push(`/trips/${tripId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
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
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

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
          <div className="flex justify-between items-center mb-4">
            <h1 className="card-title text-2xl">Edit Stay</h1>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="btn btn-sm btn-error btn-outline"
              aria-label="Delete stay"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>

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
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Dates */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="form-control w-full">
                  <label className="label" htmlFor="arrivalDate">
                    <span className="label-text font-medium">Arrival Date</span>
                    <span className="label-text-alt text-error">Required</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </span>
                    <DatePicker
                      id="arrivalDate"
                      selected={formData.arrivalDate}
                      onChange={date => handleDateChange('arrivalDate', date)}
                      className="input input-bordered w-full pl-10"
                      dateFormat="MMMM d, yyyy"
                      required
                      aria-required="true"
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
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </span>
                    <DatePicker
                      id="departureDate"
                      selected={formData.departureDate}
                      onChange={date => handleDateChange('departureDate', date)}
                      className="input input-bordered w-full pl-10"
                      dateFormat="MMMM d, yyyy"
                      minDate={new Date(formData.arrivalDate.getTime() + 86400000)} // +1 day from arrival
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="btn btn-ghost hover:bg-base-200 active:bg-base-300 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-base-300"
                    onClick={prevStep}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary hover:shadow-md active:shadow-inner active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-1"
                    onClick={nextStep}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Notes */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="form-control w-full">
                  <label className="label" htmlFor="arrivalNotes">
                    <span className="label-text font-medium">Arrival Notes</span>
                    <span className="label-text-alt">Optional</span>
                  </label>
                  <textarea
                    id="arrivalNotes"
                    name="arrivalNotes"
                    value={formData.arrivalNotes}
                    onChange={handleInputChange}
                    placeholder="Check-in instructions, contact info, etc."
                    className="textarea textarea-bordered h-20 w-full"
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label" htmlFor="departureNotes">
                    <span className="label-text font-medium">Departure Notes</span>
                    <span className="label-text-alt">Optional</span>
                  </label>
                  <textarea
                    id="departureNotes"
                    name="departureNotes"
                    value={formData.departureNotes}
                    onChange={handleInputChange}
                    placeholder="Check-out instructions, cleaning requirements, etc."
                    className="textarea textarea-bordered h-20 w-full"
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label" htmlFor="notes">
                    <span className="label-text font-medium">General Notes</span>
                    <span className="label-text-alt">Optional</span>
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Amenities, local tips, transportation, etc."
                    className="textarea textarea-bordered h-20 w-full"
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="btn btn-ghost hover:bg-base-200 active:bg-base-300 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-base-300"
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Stay</h3>
            <p className="py-4">
              Are you sure you want to delete this stay? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Deleting...
                  </>
                ) : (
                  <>Delete</>
                )}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}></div>
        </div>
      )}
    </div>
  );
}
