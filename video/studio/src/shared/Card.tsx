import React from "react";
import { C } from "./theme";

/** Прямокутна біла картка сайту: рамка 2 px, без тіні; за потреби — золота смуга ліворуч. */
export const Card: React.FC<{
  accent?: string;
  muted?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ accent, muted, style, children }) => (
  <div
    style={{
      background: muted ? C.warmLight : C.card,
      border: `2px solid ${C.line}`,
      borderLeft: accent ? `14px solid ${accent}` : `2px solid ${C.line}`,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Дрібний підпис капсом із розрядкою, як «мітки» на сайті. */
export const Label: React.FC<{ color?: string; size?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  color = C.muted,
  size = 48,
  style,
  children,
}) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color,
      lineHeight: 1.15,
      ...style,
    }}
  >
    {children}
  </div>
);
