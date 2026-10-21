import React, { useEffect, useRef } from "react";

export interface PhotoPairProps {
  previewMode?: boolean;
  className?: string;
  style?: React.CSSProperties;
  delayMs?: number;
  threshold?: number;
  children: React.ReactNode;
}

export function PhotoPair({
  previewMode = false,
  className = "couple",
  style = { marginTop: "50px" },
  delayMs = 1200,
  threshold = 0.35,
  children,
}: PhotoPairProps) {
  const coupleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const coupleEl = coupleRef.current;
    if (!coupleEl) return;

    const updateCollisionPositions = () => {
      const ps = coupleEl.querySelectorAll<HTMLElement>(".person");
      const ph = coupleEl.querySelectorAll<HTMLElement>(".photo");
      if (!ps[0] || !ps[1] || !ph[0]) return;

      const a = ps[0].getBoundingClientRect();
      const b = ps[1].getBoundingClientRect();
      const cr = coupleEl.getBoundingClientRect();
      const w = ph[0].offsetWidth;
      const off = ph[0].offsetTop - ps[0].offsetTop + w / 2;

      const ax = a.left + a.width / 2;
      const bx = b.left + b.width / 2;
      const ay = a.top + off;
      const by = b.top + off;

      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.hypot(dx, dy) || 1;
      const k = Math.max(0, (len - w) / 2) / len;

      coupleEl.style.setProperty("--x", `${dx * k}px`);
      coupleEl.style.setProperty("--y", `${dy * k}px`);
      coupleEl.style.setProperty("--sx", `${(ax + bx) / 2 - cr.left}px`);
      coupleEl.style.setProperty("--sy", `${(ay + by) / 2 - cr.top}px`);
    };

    if (previewMode) {
      updateCollisionPositions();
      coupleEl.classList.add("go");
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setTimeout(() => {
              updateCollisionPositions();
              coupleEl.classList.add("go");
            }, delayMs);
            observer.disconnect();
          }
        },
        { threshold }
      );
      observer.observe(coupleEl);

      window.addEventListener("resize", updateCollisionPositions);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", updateCollisionPositions);
      };
    }
  }, [previewMode, delayMs, threshold]);

  return (
    <div ref={coupleRef} className={className} style={style}>
      {children}
    </div>
  );
}
