import React from "react";
import { C } from "./theme";

/** Прямокутна репліка з «хвостиком» (діалог командира й керівника проєкту). */
export const Bubble: React.FC<{
  side: "left" | "right";
  tone: "light" | "dark" | "gold";
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ side, tone, style, children }) => {
  const bg = tone === "light" ? C.card : tone === "gold" ? C.gold : C.graphite;
  const fg = tone === "dark" ? C.onDark : C.ink;
  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      <div style={{ background: bg, color: fg, padding: "36px 56px", lineHeight: 1.2 }}>{children}</div>
      <svg
        width={56}
        height={40}
        viewBox="0 0 56 40"
        style={{ position: "absolute", top: "100%", [side]: 64, display: "block" }}
      >
        <path d={side === "left" ? "M0 0 L56 0 L0 40 Z" : "M0 0 L56 0 L56 40 Z"} fill={bg} />
      </svg>
    </div>
  );
};
