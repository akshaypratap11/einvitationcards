import React, { useState, useCallback } from "react";

export interface ParticleItem {
  id: number;
  left: string;
  width: number;
  height: number;
  bg: string;
  borderRadius?: string;
  opacity?: number;
  duration: string;
  delay: string;
  dx: string;
  r: string;
}

export interface UseParticlesOptions {
  count?: number;
  colors: string[];
  type?: "petal" | "confetti";
}

export function useParticles({
  count = 30,
  colors,
  type = "petal",
}: UseParticlesOptions) {
  const [particles, setParticles] = useState<ParticleItem[]>([]);

  const trigger = useCallback(
    (n: number = count) => {
      const items: ParticleItem[] = [];
      for (let i = 0; i < n; i++) {
        if (type === "confetti") {
          const w = 6 + Math.random() * 8;
          items.push({
            id: i,
            left: `${Math.random() * 100}vw`,
            width: w,
            height: w * (Math.random() < 0.5 ? 1 : 2.2),
            bg: colors[i % colors.length],
            borderRadius: Math.random() < 0.3 ? "50%" : "2px",
            opacity: 0.7 + Math.random() * 0.3,
            duration: `${6 + Math.random() * 7}s`,
            delay: `${-Math.random() * 10}s`,
            dx: `${(Math.random() - 0.5) * 260}px`,
            r: `${360 + Math.random() * 720}deg`,
          });
        } else {
          // Petal style
          const s = 8 + Math.random() * 16;
          items.push({
            id: i,
            left: `${Math.random() * 100}vw`,
            width: s,
            height: s * 1.1,
            bg: colors[i % colors.length],
            opacity: 0.6 + Math.random() * 0.35,
            duration: `${8 + Math.random() * 10}s`,
            delay: `${-Math.random() * 14}s`,
            dx: `${(Math.random() - 0.5) * 300}px`,
            r: `${360 + Math.random() * 540}deg`,
          });
        }
      }
      setParticles(items);
    },
    [colors, count, type]
  );

  return { particles, trigger, setParticles };
}

export interface ParticlesProps {
  items: ParticleItem[];
  className?: string;
}

export function Particles({ items, className = "bit" }: ParticlesProps) {
  return (
    <>
      {items.map((bit) => {
        const style: React.CSSProperties & Record<string, string | number | undefined> = {
          left: bit.left,
          width: `${bit.width}px`,
          height: `${bit.height}px`,
          background: bit.bg,
          backgroundColor: bit.bg,
          borderRadius: bit.borderRadius,
          opacity: bit.opacity,
          animationDuration: bit.duration,
          animationDelay: bit.delay,
          "--dx": bit.dx,
          "--r": bit.r,
        };

        return <div key={bit.id} className={className} style={style} />;
      })}
    </>
  );
}
