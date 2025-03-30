'use client';

import { useState } from 'react';
import { UserPlus, Send } from 'lucide-react';

interface InviteUserFormProps {
  tripId: string;
}

const InviteUserForm = ({ tripId }: InviteUserFormProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
    setSuccess(false);
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
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send invitation');
      }
      
      // Success!
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-sm btn-ghost gap-2" aria-label="Invite users">
        <UserPlus className="h-4 w-4" />
        <span>Invite</span>
      </div>
      <div tabIndex={0} className="dropdown-content z-[1] card card-compact shadow bg-base-200 w-64">
        <div className="card-body">
          <h3 className="card-title text-sm">Invite to this Trip</h3>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-xs">Email address</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="example@email.com"
                  className="input input-bordered input-sm w-full pr-10"
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-sm btn-primary btn-circle"
                  disabled={isSubmitting || !email}
                  aria-label="Send invitation"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="text-error text-xs">{error}</div>
            )}
            
            {success && (
              <div className="alert alert-success py-2 text-xs">
                <span>Invitation sent successfully!</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteUserForm;
