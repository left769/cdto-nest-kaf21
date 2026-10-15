import React from "react";
import { C, F } from "./theme";

/**
 * Рядок із горизонтальним стовпцем: назва й формула над стовпцем, довжина ∝ значенню.
 * `grow` 0 → 1 — анімація росту, `formula` — уже «надрукований» текст.
 */
export const HBar: React.FC<{
  label: string;
  formula: string;
  value: number;
  max: number;
  width: number;
  grow: number;
  color: string;
  valueText: string;
  /** Позначка після значення (напр. «основний ресурс»). */
  extra?: React.ReactNode;
}> = ({ label, formula, value, max, width, grow, color, valueText, extra }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 32 }}>
      <div style={{ fontSize: 56, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 56, fontWeight: 500, color: C.ink, whiteSpace: "nowrap", minHeight: 67 }}>{formula}</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 10, height: 48 }}>
      <div style={{ width: (width * value * grow) / max, height: 40, background: color, flexShrink: 0 }} />
      <div style={{ fontSize: F.small, fontWeight: 700, opacity: grow >= 1 ? 1 : 0, whiteSpace: "nowrap", flexShrink: 0 }}>{valueText}</div>
      {extra}
    </div>
  </div>
);
