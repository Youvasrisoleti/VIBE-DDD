import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-24 w-24',
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 bg-gray-200`}>
      <img 
        src={src} 
        alt={alt} 
        className="h-full w-full object-cover"
        onError={(e) => {
          // Fallback for broken images
          const target = e.target as HTMLImageElement;
          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random`;
        }}
      />
    </div>
  );
};

export default Avatar;