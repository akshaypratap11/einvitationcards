import { useEffect, RefObject } from "react";

export interface UseRevealOptions {
  containerRef?: RefObject<HTMLElement | null>;
  isReady?: boolean;
  previewMode?: boolean;
  threshold?: number;
}

export function useReveal({
  containerRef,
  isReady = true,
  previewMode = false,
  threshold = 0.15,
}: UseRevealOptions = {}) {
  useEffect(() => {
    if (!isReady && !previewMode) return;

    const root =
      containerRef?.current ||
      (typeof document !== "undefined" ? document.body : null);
    if (!root) return;

    const elements = root.querySelectorAll(".rv");

    if (previewMode) {
      elements.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    elements.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [containerRef, isReady, previewMode, threshold]);
}
