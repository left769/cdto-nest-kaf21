import React from "react";
import { C } from "./theme";

export type LightState = "red" | "yellow" | "green";

const LIT: Record<LightState, string> = { red: C.bad, yellow: C.yellow, green: C.ok };

/** Світлофор статусу. Колір не єдина ознака: поруч завжди слово («Жовтий»). */
export const TrafficLight: React.FC<{ state: LightState; size?: number; lit?: number }> = ({
  state,
  size = 44,
  lit = 1,
}) => (
  <div
    style={{
      display: "inline-flex",
      gap: size * 0.3,
      padding: size * 0.3,
      background: C.black,
      borderRadius: 999,
    }}
  >
    {(["red", "yellow", "green"] as const).map((s) => (
      <div
        key={s}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: s === state ? LIT[s] : "#3a3a3a",
          opacity: s === state ? 0.35 + 0.65 * lit : 1,
        }}
      />
    ))}
  </div>
);
