'use client';

import { User, Phone, X } from 'lucide-react';
import { Contact } from '../../types';

interface ContactItemProps {
  contact: Contact;
  onRemove?: (id: string) => void;
  compact?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const ContactItem = ({ contact, onRemove, compact = false, onClick }: ContactItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else {
      e.stopPropagation();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (onRemove) {
        onRemove(contact.id);
      }
    }
  };

  if (compact) {
    // Compact version for StayCard - using original StayCard styling
    return (
      <div
        className="flex items-center bg-base-100 rounded-full px-3 py-1.5 shadow-sm border border-base-300"
        onClick={handleClick}
      >
        <User className="h-4 w-4 text-primary mr-2" />
        <div className="flex flex-col">
          <span className="text-xs font-medium">{contact.name}</span>
          <a
            href={`tel:${contact.phone}`}
            className="text-xs text-primary flex items-center hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm"
            onClick={(e) => e.stopPropagation()}
            tabIndex={0}
            aria-label={`Call ${contact.name} at ${contact.phone}`}
          >
            <Phone className="h-2.5 w-2.5 mr-1" />
            {contact.phone}
          </a>
        </div>
      </div>
    );
  }

  // Regular version for Edit page - adapting the StayCard style for a larger format
  return (
    <div
      className="flex items-center justify-between bg-base-100 p-2 rounded-md"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <User className="h-5 w-5 text-primary mr-3" />
        <div>
          <p className="font-medium text-sm">{contact.name}</p>
          <p className="text-xs text-gray-500 flex items-center">
            <Phone className="h-3 w-3 mr-1" />
            {contact.phone}
          </p>
        </div>
      </div>
      {onRemove && (
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(contact.id);
          }}
          onKeyDown={handleKeyDown}
          aria-label={`Remove contact ${contact.name}`}
          tabIndex={0}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ContactItem;
