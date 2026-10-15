import React from "react";
import { C, FONT } from "./theme";

// Схематичний burn-down без чисел: частка спринту → частка залишку робіт.
// Фактична лінія доходить до середини спринту й іде вище планової.
const ACTUAL: [number, number][] = [
  [0, 1],
  [0.1, 0.97],
  [0.2, 0.94],
  [0.3, 0.89],
  [0.4, 0.86],
  [0.5, 0.8],
  [0.6, 0.76],
];

export const BurnDown: React.FC<{
  width: number;
  height: number;
  axes: number;
  plan: number;
  actual: number;
  gap: number;
  axisY: string;
  axisX: string;
  planLabel: string;
  actualLabel: string;
  gapLabel: React.ReactNode;
}> = ({ width, height, axes, plan, actual, gap, axisY, axisX, planLabel, actualLabel, gapLabel }) => {
  const left = 40;
  const top = 90;
  const right = width - 40;
  const bottom = height - 90;
  const X = (t: number) => left + (right - left) * t;
  const Y = (r: number) => bottom - (bottom - top) * r;
  const planAt = (t: number) => 1 - t;

  const pts = ACTUAL.map(([t, r]) => [X(t), Y(r)] as const);
  const len = pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  const actualPath = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  const last = ACTUAL[ACTUAL.length - 1][0];
  const gapArea =
    pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ") +
    ` L${X(last)} ${Y(planAt(last))} L${X(0)} ${Y(planAt(0))} Z`;

  return (
    <div style={{ position: "relative", width, height, fontFamily: FONT }}>
      <svg width={width} height={height} style={{ display: "block", overflow: "visible" }}>
        <g opacity={axes}>
          <line x1={left} y1={bottom} x2={left} y2={top - 40} stroke={C.ink} strokeWidth={4} />
          <line x1={left} y1={bottom} x2={right + 30} y2={bottom} stroke={C.ink} strokeWidth={4} />
          <path d={`M${left - 14} ${top - 22} L${left} ${top - 48} L${left + 14} ${top - 22}`} fill="none" stroke={C.ink} strokeWidth={4} />
          <path d={`M${right + 12} ${bottom - 14} L${right + 38} ${bottom} L${right + 12} ${bottom + 14}`} fill="none" stroke={C.ink} strokeWidth={4} />
        </g>
        <path d={gapArea} fill={C.bad} opacity={0.22 * gap} />
        <line
          x1={X(0)}
          y1={Y(1)}
          x2={X(1)}
          y2={Y(0)}
          stroke={C.muted}
          strokeWidth={6}
          strokeDasharray="22 16"
          style={{ clipPath: `inset(0 ${(1 - plan) * 100}% 0 0)` }}
        />
        <path
          d={actualPath}
          fill="none"
          stroke={C.bad}
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - actual)}
        />
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={14} fill={C.bad} opacity={actual >= 1 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", left: left + 28, top: top - 70, fontSize: 48, color: C.muted, opacity: axes }}>{axisY}</div>
      <div style={{ position: "absolute", right: 0, top: bottom + 20, fontSize: 48, color: C.muted, opacity: axes }}>{axisX}</div>
      <div
        style={{
          position: "absolute",
          left: X(0.8),
          top: Y(planAt(0.8)) + 24,
          fontSize: 48,
          color: C.muted,
          opacity: plan >= 1 ? 1 : 0,
        }}
      >
        {planLabel}
      </div>
      <div
        style={{
          position: "absolute",
          left: X(0.62) + 30,
          top: Y(0.76) - 90,
          fontSize: 48,
          fontWeight: 700,
          color: C.bad,
          opacity: actual >= 1 ? 1 : 0,
        }}
      >
        {actualLabel}
      </div>
      <div style={{ position: "absolute", left: X(0.62) + 40, top: Y(0.58) - 40, opacity: gap }}>{gapLabel}</div>
    </div>
  );
};
