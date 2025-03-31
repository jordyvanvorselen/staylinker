'use client';

interface NotificationBadgeProps {
  count: number;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  round?: boolean;
}

const NotificationBadge = ({
  count,
  position = 'top-right',
  size = 'md',
  round = false,
}: NotificationBadgeProps) => {
  if (count <= 0) return null;

  // Size classes mapping
  const sizeClasses = {
    xs: 'w-3.5 h-3.5 text-[8px]',
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
  };

  // Position classes mapping
  const positionClasses = {
    'top-right': '-top-1 -right-1',
    'bottom-right': '-bottom-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-left': '-bottom-1 -left-1',
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} flex items-center justify-center ${round ? 'rounded-full aspect-square' : 'rounded-full'} bg-error text-error-content font-bold animate-pulse-subtle`}
      aria-label={`${count} notifications`}
      role="status"
    >
      {count > 9 ? '9+' : count}
    </div>
  );
};

export default NotificationBadge;
