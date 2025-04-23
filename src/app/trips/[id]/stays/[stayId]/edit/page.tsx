'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Save, Trash2, Plus } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Contact } from '../../../../../../types';
import ContactItem from '../../../../../../components/contacts/ContactItem';

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
    arrivalTime: '',
    departureTime: '',
    arrivalNotes: '',
    departureNotes: '',
    notes: '',
    arrivalConfirmed: false,
    departureConfirmed: false,
    contacts: [] as Contact[],
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // New contact form state
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
  });

  // Contact counter for temporary client-side IDs
  const [contactCounter, setContactCounter] = useState(0);

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
          arrivalTime: data.arrivalTime || '',
          departureTime: data.departureTime || '',
          arrivalNotes: data.arrivalNotes || '',
          departureNotes: data.departureNotes || '',
          notes: data.notes || '',
          arrivalConfirmed: data.arrivalConfirmed || false,
          departureConfirmed: data.departureConfirmed || false,
          contacts: data.contacts || [],
        });

        // Set the contact counter to be higher than any existing contact IDs to avoid collisions
        if (data.contacts && data.contacts.length > 0) {
          setContactCounter(data.contacts.length);
        }
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

  // Handle new contact form changes
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new contact
  const addContact = () => {
    // Basic validation for contact
    if (!newContact.name.trim()) {
      setError('Contact name is required');
      return;
    }
    if (!newContact.phone.trim()) {
      setError('Contact phone number is required');
      return;
    }

    // Add contact to formData with temporary ID
    const contact: Contact = {
      id: `temp-${contactCounter}`, // Temporary ID for client-side usage
      name: newContact.name.trim(),
      phone: newContact.phone.trim(),
    };

    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, contact],
    }));

    // Increment counter for next contact
    setContactCounter(prev => prev + 1);

    // Reset new contact form
    setNewContact({
      name: '',
      phone: '',
    });

    setError(null);
  };

  // Remove a contact
  const removeContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter(contact => contact.id !== id),
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

  // Handle checkbox toggle changes
  const handleToggleChange = (name: string) => {
    // For arrival/departure confirmation, only allow toggling if time is set
    if (
      (name === 'arrivalConfirmed' && !formData.arrivalTime) ||
      (name === 'departureConfirmed' && !formData.departureTime)
    ) {
      // If no time is set, always set confirmed to false
      setFormData(prev => ({
        ...prev,
        [name]: false,
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }));
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

    // When moving to step 3 (Details), ensure confirmation toggles are false if no time is set
    if (step === 2) {
      const updatedFormData = { ...formData };

      // Reset arrival confirmation if no arrival time
      if (!updatedFormData.arrivalTime) {
        updatedFormData.arrivalConfirmed = false;
      }

      // Reset departure confirmation if no departure time
      if (!updatedFormData.departureTime) {
        updatedFormData.departureConfirmed = false;
      }

      setFormData(updatedFormData);
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

      // Prepare data for submission
      // For existing contacts and new contacts, we need to handle them differently
      const submissionData = {
        ...formData,
        // For contacts, we need to:
        // 1. Preserve real IDs for existing contacts (not starting with 'temp-')
        // 2. Remove temporary IDs for new contacts
        contacts: formData.contacts.map(contact => {
          if (contact.id.startsWith('temp-')) {
            // For new contacts, remove the ID so the backend can create one
            const { id, ...contactData } = contact;
            return contactData;
          }
          // For existing contacts, keep the ID
          return contact;
        }),
      };

      const response = await fetch(`/api/trips/${tripId}/stays/${stayId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
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

      // Redirect to trip detail page
      router.push(`/trips/${tripId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading stay details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6 flex justify-between items-center">
        <Link
          href={`/trips/${tripId}`}
          className="btn btn-ghost btn-sm gap-2 hover:bg-base-200 active:bg-base-300 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-base-300"
          aria-label="Back to trip"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trip
        </Link>

        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="btn btn-error btn-sm gap-2 hover:bg-error-focus active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-error-focus"
          aria-label="Delete stay"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">Edit Stay</h1>

          {/* Progress steps */}
          <ul className="steps w-full mb-8">
            <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Location</li>
            <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Dates</li>
            <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Details</li>
            <li className={`step ${step >= 4 ? 'step-primary' : ''}`}>Contacts</li>
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
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Location (City/Town)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="e.g., Paris, London, New York"
                    autoFocus
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-24"
                    placeholder="Full address of the stay"
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Dates */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Date inputs */}
                <div className="space-y-4">
                  {/* Date inputs on a single row */}
                  <div className="flex flex-row gap-4">
                    <div className="flex-1">
                      <label className="label">
                        <span className="label-text flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Arrival Date
                        </span>
                      </label>
                      <DatePicker
                        selected={formData.arrivalDate}
                        onChange={date => handleDateChange('arrivalDate', date)}
                        className="input input-bordered w-full"
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="label">
                        <span className="label-text flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Departure Date
                        </span>
                      </label>
                      <DatePicker
                        selected={formData.departureDate}
                        onChange={date => handleDateChange('departureDate', date)}
                        className="input input-bordered w-full"
                        dateFormat="MMMM d, yyyy"
                        minDate={formData.arrivalDate}
                      />
                    </div>
                  </div>

                  {/* Arrival Time section */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text">Arrival Time (optional)</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="time"
                          name="arrivalTime"
                          value={formData.arrivalTime}
                          onChange={handleInputChange}
                          className="input input-bordered w-40"
                        />
                        <label className="label cursor-pointer justify-start gap-2">
                          <input
                            type="checkbox"
                            disabled={!formData.arrivalTime}
                            checked={formData.arrivalConfirmed}
                            onChange={() => handleToggleChange('arrivalConfirmed')}
                            className="toggle toggle-success toggle-sm"
                          />
                          <span className="label-text">Confirmed</span>
                        </label>
                      </div>
                    </div>

                    <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text">Departure Time (optional)</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="time"
                          name="departureTime"
                          value={formData.departureTime}
                          onChange={handleInputChange}
                          className="input input-bordered w-40"
                        />
                        <label className="label cursor-pointer justify-start gap-2">
                          <input
                            type="checkbox"
                            disabled={!formData.departureTime}
                            checked={formData.departureConfirmed}
                            onChange={() => handleToggleChange('departureConfirmed')}
                            className="toggle toggle-success toggle-sm"
                          />
                          <span className="label-text">Confirmed</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button type="button" className="btn btn-ghost" onClick={prevStep}>
                      Back
                    </button>
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Notes about the stay (optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-24"
                    placeholder="Important information about this stay"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Arrival notes (optional)</span>
                  </label>
                  <textarea
                    name="arrivalNotes"
                    value={formData.arrivalNotes}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-20"
                    placeholder="Check-in instructions, key pickup, etc."
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Departure notes (optional)</span>
                  </label>
                  <textarea
                    name="departureNotes"
                    value={formData.departureNotes}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-20"
                    placeholder="Check-out instructions, key return, etc."
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button type="button" className="btn btn-ghost" onClick={prevStep}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Contacts */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex flex-col items-center mb-2">
                  <h3 className="text-lg font-semibold mb-1">Contacts</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Add contacts for this stay (e.g., host, property manager)
                  </p>
                </div>

                {/* Current contacts list */}
                {formData.contacts.length > 0 && (
                  <div className="bg-base-200/30 p-4 rounded-lg mb-4">
                    <h4 className="text-sm font-medium mb-2">Added Contacts:</h4>
                    <div className="space-y-2">
                      {formData.contacts.map(contact => (
                        <ContactItem key={contact.id} contact={contact} onRemove={removeContact} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Add new contact form */}
                <div className="bg-base-200/30 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Add New Contact:</h4>
                  <div className="space-y-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newContact.name}
                        onChange={handleContactInputChange}
                        className="input input-bordered"
                        placeholder="Contact name"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newContact.phone}
                        onChange={handleContactInputChange}
                        className="input input-bordered"
                        placeholder="Phone number"
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm w-full gap-1"
                      onClick={addContact}
                    >
                      <Plus className="h-4 w-4" />
                      Add Contact
                    </button>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button type="button" className="btn btn-ghost" onClick={prevStep}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary gap-2" disabled={isSubmitting}>
                    <Save className="h-4 w-4" />
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
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
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-ghost"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-error" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop bg-black opacity-30"
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
}
