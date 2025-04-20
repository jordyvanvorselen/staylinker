'use client';

import { useState } from 'react';
import { UserPlus, Send } from 'lucide-react';

interface InviteUserFormProps {
  tripId: string;
}

const InviteUserForm = ({ tripId }: InviteUserFormProps) => {
  const [email, setEmail] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
    setSuccess(false);
  };

  const handleGuestToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsGuest(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/trips/${tripId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, isGuest }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send invitation');
      }

      // Success!
      setSuccess(true);
      setEmail('');
      // Keep the modal open to show the success message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError(null);
    setSuccess(false);
    setIsGuest(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form state when modal is closed
    setEmail('');
    setIsGuest(false);
    setError(null);
    setSuccess(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Cast to HTMLElement to access the click method
      const element = e.currentTarget as HTMLElement;
      element.click();
    }
  };

  return (
    <>
      {/* Invite button to open the modal */}
      <button
        className="btn btn-sm btn-ghost gap-2"
        onClick={handleOpenModal}
        tabIndex={0}
        aria-label="Invite users"
        onKeyDown={handleKeyDown}
      >
        <UserPlus className="h-4 w-4" />
        <span>Invite</span>
      </button>

      {/* DaisyUI Modal */}
      <dialog
        id="invite_modal"
        className={`modal ${isModalOpen ? 'modal-open' : ''}`}
        onClose={handleCloseModal}
      >
        <div className="modal-box w-11/12 max-w-md">
          <h3 className="font-bold text-lg mb-4">Invite to this Trip</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="example@email.com"
                className="input input-bordered w-full"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Invite as Guest</span>
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={isGuest}
                  onChange={handleGuestToggle}
                  disabled={isSubmitting}
                />
              </label>
              <div className="text-xs text-gray-500 mt-1">
                Guests can only view trip details but cannot edit or invite others.
              </div>
            </div>

            {error && (
              <div className="alert alert-error py-2">
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success py-2">
                <span>Invitation sent successfully!</span>
              </div>
            )}

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !email}
                aria-label="Send invitation"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-xs mr-2"></span>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Invite
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleCloseModal}>Close</button>
        </form>
      </dialog>
    </>
  );
};

export default InviteUserForm;
