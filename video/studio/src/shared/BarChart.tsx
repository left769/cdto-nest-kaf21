import React from "react";
import { C, FONT } from "./theme";

export type Bar = {
  code: string;
  label: string;
  value: number;
  valueText: string;
  unit?: string;
  color: string;
  /** 0–1: наскільки стовпець виріс. */
  grow: number;
};

/** Стовпчикова діаграма на SVG: значення над стовпцем, код і підпис під ним. */
export const BarChart: React.FC<{
  bars: Bar[];
  width: number;
  height: number;
  pxPerUnit: number;
  barWidth?: number;
}> = ({ bars, width, height, pxPerUnit, barWidth = 190 }) => {
  const base = height - 150;
  const step = width / bars.length;
  return (
    <svg width={width} height={height} style={{ display: "block", fontFamily: FONT, overflow: "visible" }}>
      <line x1={0} x2={width} y1={base} y2={base} stroke={C.ink} strokeWidth={4} />
      {bars.map((b, i) => {
        const cx = step * (i + 0.5);
        const h = b.value * pxPerUnit * b.grow;
        const shown = b.grow > 0.02;
        return (
          <g key={b.code} opacity={shown ? 1 : 0}>
            <rect x={cx - barWidth / 2} y={base - h} width={barWidth} height={h} fill={b.color} />
            <text
              x={cx}
              y={base - h - 24}
              textAnchor="middle"
              fontSize={78}
              fontWeight={700}
              fill={C.ink}
              opacity={b.grow}
            >
              {b.valueText}
              {b.unit ? (
                <tspan fontSize={48} fontWeight={400} fill={C.muted}>
                  {` ${b.unit}`}
                </tspan>
              ) : null}
            </text>
            <text x={cx} y={base + 64} textAnchor="middle" fontSize={56} fontWeight={700} fill={C.ink}>
              {b.code}
            </text>
            <text x={cx} y={base + 124} textAnchor="middle" fontSize={48} fontWeight={400} fill={C.muted}>
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
