import { useEffect, useState } from "react";

interface ScoreCounterProps {
  value: number;
  className?: string;
}

export function ScoreCounter({ value, className = "" }: ScoreCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (value === displayValue) return;

    const diff = value - displayValue;
    const duration = 400;
    const steps = 12;
    const stepDuration = duration / steps;
    const increment = diff / steps;
    let current = displayValue;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return <span className={className}>{displayValue}</span>;
}
