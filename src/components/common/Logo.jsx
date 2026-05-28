import React from 'react';

/**
 * Logo component for TACTIX
 * @param {Object} props
 * @param {string} props.variant - 'icon', 'header', 'splash', 'favicon'
 * @param {string} props.size - 'sm', 'md', 'lg', 'xl' or number in px
 * @param {string} props.className - Additional CSS classes
 */
const Logo = ({ variant = 'header', size = 'md', className = '' }) => {
  // Size mapping
  const sizeMap = {
    sm: variant === 'icon' ? 32 : 100,
    md: variant === 'icon' ? 48 : 150,
    lg: variant === 'icon' ? 80 : 200,
    xl: variant === 'icon' ? 120 : 280,
  };

  const actualSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.md;

  const getLogoSrc = () => {
    if (variant === 'icon') {
      return '/icon.png';
    }
    return '/name.png';
  };

  return (
    <div className={`logo-container flex items-center justify-center ${className}`}>
      <img
        src={getLogoSrc()}
        alt="TACTIX"
        style={{
          width: actualSize,
          height: 'auto',
          maxWidth: '100%',
        }}
        className="transition-opacity duration-300 object-contain"
      />
    </div>
  );
};

export default Logo;
