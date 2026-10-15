import React from "react";
import { fadeUp, prog } from "../../shared/anim";
import { Card, Label } from "../../shared/Card";
import { Pill } from "../../shared/Pill";
import { Letter } from "../../shared/RiskLetter";
import { C, F } from "../../shared/theme";

const FLAG_X = 1700;

/** Шкала часу з прапорцем «Віха пілоту» праворуч. */
const Track: React.FC<{ y: number; label: string; dark: boolean; children: React.ReactNode }> = ({ y, label, dark, children }) => {
  const line = dark ? "#5a5a5a" : C.ink;
  const text = dark ? C.onDarkMuted : C.muted;
  return (
    <>
      <div style={{ position: "absolute", left: 120, top: y - 140 }}>
        <Label color={text}>{label}</Label>
      </div>
      <div style={{ position: "absolute", left: 120, width: FLAG_X - 120, top: y - 3, height: 6, background: line }} />
      <svg width={70} height={100} style={{ position: "absolute", left: FLAG_X - 4, top: y - 97 }}>
        <rect x={0} y={0} width={8} height={100} fill={dark ? C.onDark : C.ink} />
        <path d="M8 4 L64 22 L8 40 Z" fill={C.gold} />
      </svg>
      {children}
    </>
  );
};

/**
 * Два варіанти того самого ризику: про затримку погодження ТЗ дізналися в день віхи
 * (верхня шкала) або знали заздалегідь і мали план (нижня). Вступ і фінал сцени ескалації.
 */
export const TwoFutures: React.FC<{
  frame: number;
  dark: boolean;
  top: number;
  topAt: number;
  fireAt: number;
  bottomAt: number;
  planAt: number;
  focusAt: number;
}> = ({ frame, dark, top, topAt, fireAt, bottomAt, planAt, focusAt }) => {
  const focus = prog(frame, focusAt, 14);
  const rowA = top + 150;
  const rowB = top + 480;
  return (
    <>
      <div style={{ position: "absolute", right: 1920 - FLAG_X - 64, top: top - 10, textAlign: "right" }}>
        <Label color={dark ? C.onDark : C.ink}>Віха пілоту</Label>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - 0.7 * focus }}>
        <Track y={rowA} label="Без ризик-менеджменту" dark={dark}>
          <div style={{ position: "absolute", right: 1920 - FLAG_X + 40, top: rowA - 60, ...fadeUp(frame, topAt) }}>
            <Card accent={C.bad} style={{ padding: "22px 40px 22px 32px" }}>
              <div style={{ fontSize: F.small, fontWeight: 700 }}>Затримка погодження ТЗ</div>
            </Card>
          </div>
          <div style={{ position: "absolute", right: 1920 - FLAG_X + 40, top: rowA + 80, ...fadeUp(frame, fireAt) }}>
            <Pill tone="bad" size={F.small}>
              гасимо пожежу
            </Pill>
          </div>
        </Track>
      </div>

      <Track y={rowB} label="З ризик-менеджментом" dark={dark}>
        <div style={{ position: "absolute", left: 200, top: rowB - 60, display: "flex", alignItems: "center", gap: 28 }}>
          <div style={fadeUp(frame, bottomAt)}>
            <Card accent={C.yellow} style={{ padding: "18px 40px 18px 18px", display: "flex", alignItems: "center", gap: 24 }}>
              <Letter letter="R" size={84} />
              <div style={{ fontSize: F.small, fontWeight: 700 }}>Затримка погодження ТЗ</div>
            </Card>
          </div>
          <div style={fadeUp(frame, planAt, { dx: -24, dy: 0 })}>
            <Pill tone="gold" size={F.small}>
              план
            </Pill>
          </div>
        </div>
      </Track>
    </>
  );
};
