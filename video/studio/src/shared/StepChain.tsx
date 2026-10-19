import React from "react";
import { fadeUp, prog } from "./anim";
import { C, F } from "./theme";

const Arrow: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg width={44} height={30} style={{ flexShrink: 0, opacity }}>
    <path d="M0 15 H34 M22 3 L38 15 L22 27" fill="none" stroke={C.gold} strokeWidth={5} />
  </svg>
);

/**
 * Ланцюжок кроків «А → Б → В». Кожен крок з’являється на своєму кадрі `at`;
 * з кадру `activeFrom` крок підсвічується золотим, пройдені стають графітовими (як смуга глосарію).
 */
export const StepChain: React.FC<{
  frame: number;
  steps: { label: string; at: number; activeFrom?: number; activeTo?: number }[];
  size?: number;
}> = ({ frame, steps, size = F.small }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "nowrap" }}>
    {steps.map((s, i) => {
      const active =
        s.activeFrom === undefined ? 0 : prog(frame, s.activeFrom, 8) * (s.activeTo === undefined ? 1 : 1 - prog(frame, s.activeTo, 8));
      const done = s.activeTo === undefined ? 0 : prog(frame, s.activeTo, 8);
      const bg = active > 0.5 ? C.gold : done > 0.5 ? C.graphite : "transparent";
      const fg = active > 0.5 ? C.ink : done > 0.5 ? C.onDark : C.ink;
      const border = active > 0.5 ? C.gold : done > 0.5 ? C.graphite : C.ink;
      return (
        <React.Fragment key={s.label}>
          {i > 0 ? <Arrow opacity={prog(frame, s.at - 4, 8)} /> : null}
          <div style={fadeUp(frame, s.at - 4, { dx: -16, dy: 0 })}>
            <div
              style={{
                padding: "0.2em 0.7em",
                borderRadius: 999,
                border: `3px solid ${border}`,
                background: bg,
                color: fg,
                fontSize: size,
                fontWeight: 500,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </div>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);
