import React from 'react';

interface OfficialVerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const OfficialVerifiedBadge: React.FC<OfficialVerifiedBadgeProps> = ({
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 sm:w-7 sm:h-7 text-xs sm:text-sm'
  };
  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5 sm:w-4 sm:h-4'
  };

  return (
    <span
      className={`inline-flex items-center align-middle ${className}`}
      aria-label="Official Sadan Rai archive mark"
      role="img"
    >
      <span className={`inline-flex items-center justify-center rounded-full bg-[#A16207] text-[#FFF8E7] shadow-sm ring-1 ring-inset ring-[#D6B46A]/70 select-none ${sizeClasses[size]}`}>
        <svg
          className={`${iconSizes[size]} fill-current stroke-current stroke-1`}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </span>
  );
};
