import React from "react";
import { CountdownState } from "./useCountdown";

export interface CountdownLabels {
  days?: string;
  hours?: string;
  minutes?: string;
  seconds?: string;
}

export interface CountdownProps {
  countdown: CountdownState;
  labels?: CountdownLabels;
  whenText?: React.ReactNode;
  className?: string;
  whenClassName?: string;
  whenStyle?: React.CSSProperties;
  whenId?: string;
  ids?: {
    days?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
  };
}

export function Countdown({
  countdown,
  labels = {
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
  },
  whenText,
  className = "cd rv z d2",
  whenClassName = "rv d3",
  whenStyle,
  whenId,
  ids,
}: CountdownProps) {
  return (
    <>
      <div className={className}>
        <div>
          <b id={ids?.days}>{countdown.days}</b>
          <small>{labels.days || "Days"}</small>
        </div>
        <i>:</i>
        <div>
          <b id={ids?.hours}>{countdown.hours}</b>
          <small>{labels.hours || "Hours"}</small>
        </div>
        <i>:</i>
        <div>
          <b id={ids?.minutes}>{countdown.minutes}</b>
          <small>{labels.minutes || "Minutes"}</small>
        </div>
        <i>:</i>
        <div>
          <b id={ids?.seconds}>{countdown.seconds}</b>
          <small>{labels.seconds || "Seconds"}</small>
        </div>
      </div>

      {whenText && (
        <div id={whenId} className={whenClassName} style={whenStyle}>
          {whenText}
        </div>
      )}
    </>
  );
}
