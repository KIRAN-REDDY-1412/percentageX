import { useState, useEffect } from "react";

/**
 * StatCounter: Smooth count-up animation for numeric stats.
 * Supports prefixes, suffixes, and formatted strings (e.g., "88%", "40 Students", "36 / 40").
 */
export default function StatCounter({ value, duration = 800, prefix = "", suffix = "" }) {
  // Extract number if value is string with symbols like "88%"
  const numValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.]/g, ""));
  const isNumeric = !isNaN(numValue);

  const [displayVal, setDisplayVal] = useState(() => (isNumeric ? 0 : value));

  useEffect(() => {
    if (!isNumeric) {
      setDisplayVal(value);
      return;
    }

    let start = 0;
    const end = numValue;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo function
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;

      // Check if original has decimals
      const hasDecimal = String(numValue).includes(".");
      setDisplayVal(hasDecimal ? current.toFixed(1) : Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayVal(end);
      }
    };

    requestAnimationFrame(update);
  }, [numValue, duration, isNumeric, value]);

  if (!isNumeric) return <span>{value}</span>;

  return (
    <span className="stat-counter-val">
      {prefix}
      {displayVal}
      {suffix}
    </span>
  );
}
