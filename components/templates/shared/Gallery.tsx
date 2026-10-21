/* eslint-disable @next/next/no-img-element */
import React from "react";

export interface GalleryPlaceholder {
  emoji: string;
  bg: string;
}

export interface GalleryProps {
  images?: string[];
  placeholders?: GalleryPlaceholder[];
  showPlaceholders?: boolean;
  renderMode?: "bg" | "img";
  maxImages?: number;
  gradients?: string[];
  altPrefix?: string;
  className?: string;
}

export function Gallery({
  images = [],
  placeholders = [],
  showPlaceholders = false,
  renderMode = "bg",
  maxImages = 12,
  gradients,
  altPrefix = "Gallery photo",
  className = "gal",
}: GalleryProps) {
  const hasPhotos = images && images.length > 0;
  if (!hasPhotos && !showPlaceholders) return null;

  const displayImages = images.slice(0, maxImages);

  return (
    <div className={className}>
      {hasPhotos
        ? displayImages.map((photoUrl, index) => {
            const delayClass =
              index % 3 === 1 ? "d1" : index % 3 === 2 ? "d2" : "";
            const bg = gradients ? gradients[index % gradients.length] : undefined;

            if (renderMode === "img") {
              return (
                <div
                  key={index}
                  className={`rv z ${delayClass}`.trim()}
                  style={bg ? { background: bg } : undefined}
                >
                  <img
                    src={photoUrl}
                    alt={`${altPrefix} ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`rv z ${delayClass}`.trim()}
                style={{ backgroundImage: `url(${photoUrl})` }}
              />
            );
          })
        : placeholders.map((tile, index) => {
            const delayClass =
              index % 3 === 1 ? "d1" : index % 3 === 2 ? "d2" : "";
            return (
              <div
                key={index}
                className={`rv z ${delayClass}`.trim()}
                style={{ backgroundColor: tile.bg }}
              >
                {tile.emoji}
              </div>
            );
          })}
    </div>
  );
}
