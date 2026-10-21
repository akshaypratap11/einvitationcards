import React from "react";

export interface SectionHeadingProps {
  ornament?: boolean;
  eyebrow?: React.ReactNode;
  eyebrowStyle?: React.CSSProperties;
  titlePrefix?: React.ReactNode;
  highlight?: React.ReactNode;
  titleSuffix?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeading({
  ornament = true,
  eyebrow,
  eyebrowStyle,
  titlePrefix,
  highlight,
  titleSuffix,
  title,
  subtitle,
  titleClassName = "rv d1",
  subtitleClassName = "sub rv d2",
}: SectionHeadingProps) {
  return (
    <>
      {ornament && (
        <div className="orn rv">
          <i />✦<i />
        </div>
      )}

      {eyebrow && (
        <div className="eyebrow rv" style={eyebrowStyle}>
          {eyebrow}
        </div>
      )}

      {(title || titlePrefix || highlight || titleSuffix) && (
        <h2 className={titleClassName}>
          {title ? (
            title
          ) : (
            <>
              {titlePrefix && <>{titlePrefix} </>}
              {highlight && <span className="gold-text">{highlight}</span>}
              {titleSuffix && <> {titleSuffix}</>}
            </>
          )}
        </h2>
      )}

      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </>
  );
}
