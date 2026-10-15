import React from "react";
import { C } from "./theme";

export type PillTone = "gold" | "yellow" | "dark" | "black" | "ok" | "bad" | "outline" | "ghost" | "dim";

const TONES: Record<PillTone, { background: string; color: string; border: string }> = {
  gold: { background: C.gold, color: C.ink, border: C.gold },
  yellow: { background: C.yellow, color: C.ink, border: C.yellow },
  dark: { background: C.graphite, color: C.onDark, border: C.graphite },
  black: { background: C.black, color: C.onDark, border: C.black },
  ok: { background: C.ok, color: C.onDark, border: C.ok },
  bad: { background: C.bad, color: C.onDark, border: C.bad },
  outline: { background: "transparent", color: C.ink, border: C.ink },
  ghost: { background: C.warmLight, color: C.ink, border: C.line },
  dim: { background: "#d9d6cf", color: C.muted, border: "#d9d6cf" },
};

/** Золота «пігулка» сайту: єдиний заокруглений елемент. */
export const Pill: React.FC<{
  tone?: PillTone;
  size?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ tone = "gold", size = 48, style, children }) => {
  const t = TONES[tone];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35em",
        padding: "0.2em 0.75em",
        borderRadius: 999,
        border: `3px solid ${t.border}`,
        background: t.background,
        color: t.color,
        fontSize: size,
        fontWeight: 500,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
