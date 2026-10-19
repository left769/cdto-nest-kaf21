import React from "react";
import { Pill } from "./Pill";
import { C, F } from "./theme";

/** Сіра «пігулка»-антиприклад, яку перекреслює лінія (`strike` 0 → 1). */
export const StruckPill: React.FC<{ strike: number; size?: number; children: React.ReactNode }> = ({ strike, size = F.small, children }) => (
  <div style={{ position: "relative", display: "inline-block" }}>
    <Pill tone="dim" size={size}>
      {children}
    </Pill>
    <div
      style={{
        position: "absolute",
        left: "6%",
        top: "50%",
        height: 6,
        width: `${88 * strike}%`,
        background: C.muted,
      }}
    />
  </div>
);
