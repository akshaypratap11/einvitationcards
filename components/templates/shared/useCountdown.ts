import { useState, useEffect } from "react";

export interface CountdownState {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isPassed: boolean;
}

export function useCountdown(mainDate: string | Date | undefined): CountdownState {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isPassed: false,
  });

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    if (!mainDate) return;

    const targetTime = new Date(mainDate).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (isNaN(diff) || diff <= 0) {
        setCountdown({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          isPassed: true,
        });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const d = Math.floor(totalSeconds / 86400);
      const h = Math.floor((totalSeconds % 86400) / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      setCountdown({
        days: pad(d),
        hours: pad(h),
        minutes: pad(m),
        seconds: pad(s),
        isPassed: false,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [mainDate]);

  return countdown;
}
