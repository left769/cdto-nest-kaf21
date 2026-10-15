import React from "react";
import { interpolateColors } from "remotion";
import { Card } from "./Card";
import { Letter } from "./RiskLetter";
import { C, F } from "./theme";

/**
 * Картка запису, що з ризику (R) стає проблемою (I): `move` 0 → 1 змінює літеру,
 * колір рамки й підпис. Позицію задає обгортка.
 */
export const RiskIssueCard: React.FC<{ move: number; title: string; risk?: string; issue?: string }> = ({
  move,
  title,
  risk = "ризик",
  issue = "проблема",
}) => (
  <Card
    style={{
      display: "flex",
      alignItems: "center",
      gap: 28,
      padding: "20px 40px 20px 20px",
      borderColor: interpolateColors(move, [0, 1], [C.yellow, C.bad]),
      borderWidth: 4,
    }}
  >
    <div style={{ position: "relative", width: 124, height: 124 }}>
      <Letter letter="R" size={124} style={{ position: "absolute", opacity: 1 - move }} />
      <Letter letter="I" size={124} style={{ position: "absolute", opacity: move }} />
    </div>
    <div style={{ width: 500 }}>
      <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
      <div style={{ position: "relative", fontSize: F.small, fontWeight: 500, marginTop: 8, height: 58 }}>
        <span style={{ position: "absolute", opacity: 1 - move, color: C.muted }}>{risk}</span>
        <span style={{ position: "absolute", opacity: move, color: C.bad }}>{issue}</span>
      </div>
    </div>
  </Card>
);
