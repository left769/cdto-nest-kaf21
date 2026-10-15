import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, prog } from "../../../shared/anim";
import { Card } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z4Frame } from "../frame";
import { GLOSSARY } from "../script";

// Власники зі зразка кроку 4 зошита.
const ROWS = [
  { risk: "Затримка погодження ТЗ", owner: "PM", at: "o1" },
  { risk: "Надмірний доступ до даних про майно", owner: "BA", at: "o2" },
  { risk: "Несумісність форматів", owner: "Data Analyst", at: "o3" },
  { risk: "Ротація PM", owner: "DT Lead", at: "o4" },
];

export const S4Owner: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const column = prog(frame, cue("notPm") - 4, 12);
  const last = prog(frame, cue("o4") + 10, 12);

  return (
    <T2Z4Frame timing={timing} current={3} done={3}>
      <TermCard frame={frame} at={0} outAt={cue("role") - 22} index={3} count={GLOSSARY.length} title="Risk owner" uk="власник ризику" />

      {/* Роль власника */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 150, ...fadeUp(frame, cue("role") - 4) }}>
        <Card accent={C.gold} style={{ padding: "24px 48px 28px 40px" }}>
          <div style={{ fontSize: 56, fontWeight: 500 }}>Стежить за ризиком і виконує план реагування</div>
          <div style={{ fontSize: F.body, fontWeight: 700, marginTop: 10, ...fadeUp(frame, cue("noOwner") - 4, { dy: 16 }) }}>
            Ризик без власника не контролюється
          </div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 120, top: 372, fontSize: F.small, color: C.muted, ...fadeUp(frame, cue("notPm") - 4, { dy: 16 }) }}>
        Власник — той, хто найкраще може вплинути на ризик
      </div>

      {/* Фрагмент реєстру: ризик → власник */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 450, opacity: prog(frame, cue("notPm"), 12) }}>
        <Card style={{ padding: 0 }}>
          {[{ risk: "Ризик", owner: "Власник", at: "" }, ...ROWS].map((row, i) => {
            const isHead = i === 0;
            const isLast = i === ROWS.length;
            return (
              <div
                key={row.risk}
                style={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: isHead ? 80 : 92,
                  borderTop: isHead ? "none" : `2px solid ${C.line}`,
                  fontSize: isHead ? F.small : 52,
                  fontWeight: isHead ? 500 : 400,
                  color: isHead ? C.muted : C.ink,
                  background: isLast ? `rgba(243, 146, 0, ${0.12 * last})` : "transparent",
                }}
              >
                <div style={{ flex: 1, paddingLeft: 40, display: "flex", alignItems: "center", gap: 28 }}>
                  {row.risk}
                  {isLast ? (
                    <div style={{ opacity: last }}>
                      <Pill tone="gold" size={F.small}>
                        не обов’язково PM
                      </Pill>
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    width: 480,
                    alignSelf: "stretch",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 40,
                    background: `rgba(243, 146, 0, ${(isHead ? 1 : 0.22) * column})`,
                    color: isHead ? (column > 0.5 ? C.ink : C.muted) : C.ink,
                    fontWeight: isHead ? 700 : 500,
                  }}
                >
                  <span style={{ opacity: isHead ? 1 : prog(frame, cue(row.at) - 4, 8) }}>{row.owner}</span>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </T2Z4Frame>
  );
};
