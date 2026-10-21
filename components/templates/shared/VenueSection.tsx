import React from "react";

export interface VenueSectionProps {
  venueTitle: React.ReactNode;
  venueAddress?: React.ReactNode;
  badgeTagline?: React.ReactNode;
  dateText?: React.ReactNode;
  timeText?: React.ReactNode;
  directionsUrl: string;
  calendarUrl: string;
  directionsLabel?: string;
  calendarLabel?: string;
  mapEmbedUrl?: string;
  mapPlaceholderText?: string;
  dateClassName?: string;
  dateStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
}

export function VenueSection({
  venueTitle,
  venueAddress,
  badgeTagline,
  dateText,
  timeText,
  directionsUrl,
  calendarUrl,
  directionsLabel = "Get Directions",
  calendarLabel = "Add to Calendar",
  mapEmbedUrl,
  mapPlaceholderText,
  dateClassName,
  dateStyle = { fontSize: "22px", margin: "6px 0" },
  className = "venue",
  style = { marginTop: "40px" },
}: VenueSectionProps) {
  return (
    <div className={className} style={style}>
      <div className="rv l">
        <h3>{venueTitle}</h3>
        {venueAddress && (
          <div style={{ opacity: 0.9, marginTop: "6px", fontWeight: 500 }}>
            {typeof venueAddress === "string" && !venueAddress.startsWith("📍")
              ? `📍 ${venueAddress}`
              : venueAddress}
          </div>
        )}

        {(badgeTagline || dateText || timeText) && (
          <div className="box">
            {badgeTagline && <small>{badgeTagline}</small>}
            {dateText && (
              <div className={dateClassName} style={dateStyle}>
                {dateText}
              </div>
            )}
            {timeText && <div style={{ opacity: 0.85, fontWeight: 500 }}>{timeText}</div>}
          </div>
        )}

        <a
          className="btn b1"
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          ↗ {directionsLabel}
        </a>
        <a
          className="btn b2"
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          📅 {calendarLabel}
        </a>
      </div>

      <div className="map rv r">
        {mapEmbedUrl ? (
          <iframe
            title={`Map to ${typeof venueTitle === "string" ? venueTitle : "Venue"}`}
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <>
            📍
            <span>
              {mapPlaceholderText ||
                (typeof venueTitle === "string" ? venueTitle : "")}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
