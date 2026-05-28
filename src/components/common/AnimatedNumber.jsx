import { useEffect, useState } from 'react';

export default function AnimatedNumber({ value, duration = 1500, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const end = parseFloat(value);
    if (isNaN(end)) {
      setDisplayValue(value); // fallback if not a number
      return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quart for a snappy then smooth stop
      const easeOut = 1 - Math.pow(1 - progress, 4);
      
      // We use Math.round to support numbers that don't need decimal places
      // If decimal is needed, we could expand this component.
      setDisplayValue(Math.round(easeOut * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(end);
      }
    };
    
    // reset to 0 before animating up again if value changes
    setDisplayValue(0);
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <>{prefix}{displayValue}{suffix}</>
  );
}
