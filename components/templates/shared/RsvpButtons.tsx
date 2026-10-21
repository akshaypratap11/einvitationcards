import React from "react";

export interface RsvpButtonsProps {
  yesUrl: string;
  noUrl: string;
  yesLabel: string;
  noLabel: string;
  className?: string;
  yesButtonClass?: string;
  noButtonClass?: string;
}

export function RsvpButtons({
  yesUrl,
  noUrl,
  yesLabel,
  noLabel,
  className = "rv d3",
  yesButtonClass = "btn b3",
  noButtonClass = "btn b2",
}: RsvpButtonsProps) {
  return (
    <div className={className}>
      <a
        className={yesButtonClass}
        href={yesUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {yesLabel}
      </a>
      <a
        className={noButtonClass}
        href={noUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {noLabel}
      </a>
    </div>
  );
}
