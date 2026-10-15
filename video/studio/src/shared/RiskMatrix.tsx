import React from "react";
import { interpolateColors } from "remotion";
import { EASE_IN_OUT, prog } from "./anim";
import { Label } from "./Card";
import { C, F } from "./theme";

export type Zone = "red" | "yellow" | "green";

// Ризик-матриця з Додатка 1 заняття Т2·З4: рядки — ймовірність (висока → низька),
// стовпці — вплив (низький → високий).
export const MATRIX_LEVELS = [
  ["Середній", "Високий", "Критичний"],
  ["Низький", "Середній", "Високий"],
  ["Низький", "Низький", "Середній"],
] as const;
export const ROW_LABELS = ["Висока", "Середня", "Низька"] as const;
export const COL_LABELS = ["Низький", "Середній", "Високий"] as const;

const zoneOf = (level: string): Zone =>
  level === "Критичний" || level === "Високий" ? "red" : level === "Середній" ? "yellow" : "green";

const ZONE_BG: Record<Zone, string> = { red: C.bad, yellow: C.yellow, green: C.ok };
const ZONE_FG: Record<Zone, string> = { red: C.onDark, yellow: C.ink, green: C.onDark };

// Геометрія в координатах кадру 1920×1080.
export const MATRIX = { left: 380, top: 285, cellW: 320, cellH: 150, headerTop: 215, axisX: 120 };
export const cellCenter = (row: number, col: number) => ({
  x: MATRIX.left + col * MATRIX.cellW + MATRIX.cellW / 2,
  y: MATRIX.top + row * MATRIX.cellH + MATRIX.cellH / 2,
});

export type MatrixMarker = { row: number; col: number; n: number; at: number; from: { x: number; y: number } };

/**
 * Ризик-матриця 3 × 3. Зони фарбуються з кадру `colorAt`; `emphasis` по черзі виділяє зони
 * (решта тьмяніє) до кадру `emphasisEnd`; номерні мітки ризиків прилітають у клітинки.
 * У кожній клітинці — слово рівня: колір не єдина ознака.
 */
export const RiskMatrix: React.FC<{
  frame: number;
  appearAt: number;
  colorAt: number;
  emphasis: { zone: Zone; at: number }[];
  emphasisEnd: number;
  markers: MatrixMarker[];
}> = ({ frame, appearAt, colorAt, emphasis, emphasisEnd, markers }) => {
  const colored = prog(frame, colorAt, 18, EASE_IN_OUT);
  const dimming = emphasis.length ? prog(frame, emphasis[0].at, 8) * (1 - prog(frame, emphasisEnd, 10)) : 0;
  const highlight = (zone: Zone) =>
    emphasis.reduce((h, e, i) => {
      if (e.zone !== zone) return h;
      const end = i + 1 < emphasis.length ? emphasis[i + 1].at : emphasisEnd;
      return Math.max(h, prog(frame, e.at, 8) * (1 - prog(frame, end, 8)));
    }, 0);
  const width = MATRIX.cellW * 3;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: prog(frame, appearAt, 12) }}>
      {/* Осі */}
      <div style={{ position: "absolute", left: MATRIX.axisX, top: 150 }}>
        <Label>Ймовірність ↓</Label>
      </div>
      <div style={{ position: "absolute", left: MATRIX.left, width, top: 150, textAlign: "center" }}>
        <Label>Вплив →</Label>
      </div>
      {COL_LABELS.map((label, c) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: MATRIX.left + c * MATRIX.cellW,
            width: MATRIX.cellW,
            top: MATRIX.headerTop,
            textAlign: "center",
            fontSize: F.small,
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      ))}
      {ROW_LABELS.map((label, r) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: MATRIX.axisX,
            width: MATRIX.left - MATRIX.axisX - 24,
            top: MATRIX.top + r * MATRIX.cellH,
            height: MATRIX.cellH,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            fontSize: F.small,
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      ))}

      {/* Клітинки */}
      {MATRIX_LEVELS.map((row, r) =>
        row.map((level, c) => {
          const zone = zoneOf(level);
          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: "absolute",
                left: MATRIX.left + c * MATRIX.cellW,
                top: MATRIX.top + r * MATRIX.cellH,
                width: MATRIX.cellW,
                height: MATRIX.cellH,
                boxSizing: "border-box",
                border: `3px solid ${C.warm}`,
                padding: "12px 12px",
                background: interpolateColors(colored, [0, 1], [C.card, ZONE_BG[zone]]),
                color: interpolateColors(colored, [0, 1], [C.ink, ZONE_FG[zone]]),
                fontSize: F.small,
                fontWeight: 500,
                opacity: 1 - 0.7 * dimming * (1 - highlight(zone)),
              }}
            >
              {level}
            </div>
          );
        }),
      )}

      {/* Номерні мітки ризиків */}
      {markers.map((m) => {
        const t = prog(frame, m.at, 24, EASE_IN_OUT);
        const to = cellCenter(m.row, m.col);
        const x = m.from.x + (to.x + 70 - m.from.x) * t;
        const y = m.from.y + (to.y + 30 - m.from.y) * t;
        return (
          <div
            key={m.n}
            style={{
              position: "absolute",
              left: x - 36,
              top: y - 36,
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: C.ink,
              color: C.onDark,
              border: `4px solid ${C.card}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: F.small,
              fontWeight: 700,
              opacity: prog(frame, m.at, 6),
            }}
          >
            {m.n}
          </div>
        );
      })}
    </div>
  );
};
