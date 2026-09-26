import { useEffect, useState } from "react";
import type { useCountUpOptions } from "../types";

export const useCountUp = (
  target: number,
  { duration = 1200, decimals = 0 }: useCountUpOptions = {},
) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    const startValue = 0;
    const step = (timeStamp: number) => {
      if (!startTimestamp) startTimestamp = timeStamp;
      const progress = Math.min((timeStamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * easeOut;
      setCount(current);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(current);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);
  return count.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
