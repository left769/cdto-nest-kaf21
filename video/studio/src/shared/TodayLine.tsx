import React from "react";
import { fadeUp } from "./anim";
import { Label } from "./Card";
import { C, F } from "./theme";

export const TODAY_X = 960;

/**
 * Межа «сьогодні»: ліворуч те, що вже сталося, праворуч те, що може статися.
 * Горизонтальна вісь, вертикальна лінія й мітка «СЬОГОДНІ» з’являються на кадрі `at`.
 */
export const TodayLine: React.FC<{ frame: number; at: number; left?: string; right?: string }> = ({
  frame,
  at,
  left = "вже сталося",
  right = "може статися",
}) => (
  <>
    <div style={{ position: "absolute", left: 120, right: 120, top: 175, display: "flex", justifyContent: "space-between" }}>
      <Label>{left}</Label>
      <Label>{right}</Label>
    </div>
    <div style={{ position: "absolute", left: 120, right: 120, top: 560, height: 6, background: C.line }} />
    <div
      style={{
        position: "absolute",
        left: TODAY_X - 4,
        top: 250,
        width: 8,
        height: 620,
        background: C.ink,
        ...fadeUp(frame, at, { dy: 0 }),
      }}
    />
    <div style={{ position: "absolute", left: TODAY_X, top: 790, translate: "-50% 0px" }}>
      <div
        style={{
          background: C.ink,
          color: C.onDark,
          fontSize: F.small,
          fontWeight: 700,
          padding: "8px 28px",
          letterSpacing: "0.06em",
          ...fadeUp(frame, at),
        }}
      >
        СЬОГОДНІ
      </div>
    </div>
  </>
);
