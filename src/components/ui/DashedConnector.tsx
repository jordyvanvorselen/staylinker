'use client';

type HeightOption = 4 | 6 | 8 | 10 | 12 | 16;
type ColorOption = 'primary' | 'secondary' | 'accent' | 'gray-300' | 'gray-400' | 'warning';
type OpacityOption = 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

interface DashedConnectorProps {
  height?: HeightOption;
  className?: string;
  color?: ColorOption;
  opacity?: OpacityOption;
  spacing?: 'mb-2' | 'mb-4' | 'mt-2' | 'mt-4' | 'my-2' | 'my-4';
}

const DashedConnector = ({
  height = 8,
  className = '',
  color = 'gray-300',
  opacity = 70,
  spacing,
}: DashedConnectorProps) => {
  // Map for height classes
  const heightClasses: Record<HeightOption, string> = {
    4: 'h-4',
    6: 'h-6',
    8: 'h-8',
    10: 'h-10',
    12: 'h-12',
    16: 'h-16',
  };

  // Map for opacity classes
  const opacityClasses: Record<OpacityOption, string> = {
    30: 'opacity-30',
    40: 'opacity-40',
    50: 'opacity-50',
    60: 'opacity-60',
    70: 'opacity-70',
    80: 'opacity-80',
    90: 'opacity-90',
    100: 'opacity-100',
  };

  // Compose the className
  const baseClasses = `border-l-2 border-dashed border-${color} ${opacityClasses[opacity]} ${heightClasses[height]}`;
  const classes = spacing
    ? `${baseClasses} ${spacing} ${className}`
    : `${baseClasses} ${className}`;

  return <div className={classes} aria-hidden="true" />;
};

export default DashedConnector;
