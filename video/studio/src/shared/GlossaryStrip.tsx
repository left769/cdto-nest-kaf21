import React from "react";
import { C, STRIP_H } from "./theme";

export type GlossaryState = {
  labels: readonly string[];
  /** Поточна комірка (золота) або null. */
  current: number | null;
  /** Скільки комірок уже пройдено (заповнені). */
  done: number;
};

/** Центр комірки в координатах кадру 1920×1080: звідси прилітають і сюди відлітають картки. */
export const cellCenter = (index: number, count: number) => ({
  x: (1920 / count) * (index + 0.5),
  y: 1080 - STRIP_H / 2,
});

/** Смуга глосарію внизу кадру (бриф 3): показує поточне поняття й скільки лишилося. */
export const GlossaryStrip: React.FC<GlossaryState & { style?: React.CSSProperties }> = ({
  labels,
  current,
  done,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: STRIP_H,
      display: "flex",
      background: C.black,
      borderTop: `2px solid ${C.graphite}`,
      ...style,
    }}
  >
    {labels.map((label, i) => {
      const isCurrent = i === current;
      const isDone = i < done && !isCurrent;
      return (
        <div
          key={label}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 20px",
            borderLeft: i === 0 ? "none" : `2px solid ${C.graphite}`,
            borderTop: `6px solid ${isCurrent ? C.gold : isDone ? C.gold : "transparent"}`,
            background: isCurrent ? C.gold : isDone ? C.graphite : C.black,
            color: isCurrent ? C.ink : isDone ? C.onDark : C.dim,
            fontSize: 48,
            fontWeight: isCurrent ? 700 : 500,
            lineHeight: 1.05,
          }}
        >
          <span>
            {label.split("/").map((part, k, parts) => (
              <React.Fragment key={part}>
                <span style={{ whiteSpace: "nowrap" }}>{k < parts.length - 1 ? `${part}/` : part}</span>
                {k < parts.length - 1 ? <wbr /> : null}
              </React.Fragment>
            ))}
          </span>
        </div>
      );
    })}
  </div>
);
