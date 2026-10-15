import React from "react";
import { C } from "./theme";

// Типи записів RAID-log. Колір не єдина ознака: на плитці завжди літера.
export const RAID_COLORS = {
  R: { bg: C.yellow, fg: C.ink },
  A: { bg: C.graphite, fg: C.onDark },
  I: { bg: C.bad, fg: C.onDark },
  D: { bg: C.black, fg: C.onDark },
} as const;

export type RaidType = keyof typeof RAID_COLORS;

/** Квадратна плитка з літерою типу запису (R, A, I, D). */
export const Letter: React.FC<{ letter: RaidType; size: number; style?: React.CSSProperties }> = ({ letter, size, style }) => (
  <div
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: RAID_COLORS[letter].bg,
      color: RAID_COLORS[letter].fg,
      fontSize: size * 0.62,
      fontWeight: 700,
      ...style,
    }}
  >
    {letter}
  </div>
);
