import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z7Frame } from "../frame";
import { GLOSSARY } from "../script";

// Стики й ризики — розділ 3.2; як знижувати — 3.3; джерело істини — 3.4 заняття.
const SEAMS = [
  { at: "sys", side: "Система", risk: "несумісні формати даних, версії, протоколи" },
  { at: "team", side: "Команда", risk: "різні припущення, «нічия зона» відповідальності" },
  { at: "proc", side: "Процес", risk: "розрив: хтось не передав результат далі" },
];
const ACTIONS = [
  { at: "a1", title: "Контракт стику", detail: "формат даних, хто що передає й коли" },
  { at: "a2", title: "Власник з обох боків", detail: "" },
  { at: "a3", title: "Раннє тестування інтеграції", detail: "а не «на кінець»" },
  { at: "a4", title: "«Нічиї зони» → RACI", detail: "" },
];

const Plate: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 300,
      height: 120,
      boxSizing: "border-box",
      background: C.card,
      border: `2px solid ${C.line}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: F.small,
      fontWeight: 700,
    }}
  >
    {children}
  </div>
);

/** Шов між плашками — тут живе ризик. */
const Seam: React.FC = () => (
  <svg width={40} height={120} viewBox="0 0 40 120" style={{ flexShrink: 0 }}>
    <path d="M20 0 L8 20 L32 40 L8 60 L32 80 L8 100 L20 120" fill="none" stroke={C.bad} strokeWidth={6} />
  </svg>
);

export const S3Interface: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z7Frame timing={timing} current={2} done={2}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("most") - 22}
        index={2}
        count={GLOSSARY.length}
        title="Interface point"
        uk="точка стику систем, команд чи процесів"
      />

      {/* Три види стиків */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("most") - 4, cue("reduce") - 10) }}>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <Label>Більшість інтеграційних ризиків — на стиках</Label>
        </div>
        {SEAMS.map((s, i) => (
          <div key={s.at} style={{ position: "absolute", left: 120, right: 120, top: 240 + i * 200, display: "flex", alignItems: "center", gap: 0, ...fadeUp(frame, cue(s.at) - 4) }}>
            <Plate>{s.side}</Plate>
            <Seam />
            <Plate>{s.side}</Plate>
            <div style={{ fontSize: F.small, fontWeight: 700, lineHeight: 1.2, marginLeft: 48, color: C.ink }}>{s.risk}</div>
          </div>
        ))}
      </div>

      {/* Чотири дії */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("reduce") - 4, cue("truth") - 10) }}>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <Label>Як знизити ризик на стику</Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 230, display: "flex", flexDirection: "column", gap: 18 }}>
          {ACTIONS.map((a, i) => (
            <div key={a.at} style={fadeUp(frame, cue(a.at) - 4, { dx: -24, dy: 0 })}>
              <Card accent={C.gold} style={{ padding: "18px 36px 20px 28px", display: "flex", alignItems: "baseline", gap: 24 }}>
                <div style={{ fontSize: F.body, fontWeight: 700, color: C.gold, width: 48 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 56, fontWeight: 700 }}>{a.title}</div>
                  {a.detail ? <div style={{ fontSize: F.small, color: C.muted, marginTop: 2 }}>{a.detail}</div> : null}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Джерело істини */}
      <div style={{ position: "absolute", inset: 0, ...fadeUp(frame, cue("truth") - 4) }}>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <Label>Обмін даними · джерело істини</Label>
        </div>
        {[
          { name: "Система обліку", left: 120, primary: false },
          { name: "Кадрова система", left: 1040, primary: true },
        ].map((sys) => {
          const on = sys.primary ? prog(frame, cue("primary") - 4, 12) : 0;
          return (
            <div key={sys.name} style={{ position: "absolute", left: sys.left, top: 240, width: 760 }}>
              <div
                style={{
                  background: C.card,
                  border: `${on > 0.5 ? 6 : 2}px solid ${on > 0.5 ? C.gold : C.line}`,
                  padding: "26px 36px 32px",
                  height: 380,
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontSize: 56, fontWeight: 700 }}>{sys.name}</div>
                <div
                  style={{
                    marginTop: 30,
                    padding: "16px 24px",
                    background: C.warmLight,
                    border: `2px solid ${C.line}`,
                    fontSize: F.small,
                    ...fadeUp(frame, cue("rank") - 4),
                  }}
                >
                  поле <b>«звання»</b>
                </div>
                <div style={{ marginTop: 24, opacity: on }}>
                  <Pill tone="gold" size={F.small}>
                    джерело істини
                  </Pill>
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 880, width: 160, top: 360, textAlign: "center", fontSize: 110, fontWeight: 700, color: C.bad, opacity: inOut(frame, cue("rank") + 10, cue("primary") - 4) }}>
          ≠
        </div>
        <svg width={160} height={60} style={{ position: "absolute", left: 880, top: 400, opacity: prog(frame, cue("primary") + 8, 12) }}>
          <path d="M150 30 H14 M34 10 L10 30 L34 50" fill="none" stroke={C.gold} strokeWidth={8} />
        </svg>
        <div style={{ position: "absolute", left: 120, right: 120, top: 640, fontSize: F.small, fontWeight: 700, ...fadeUp(frame, cue("primary") + 16) }}>
          Без цього дані двох систем розійдуться
        </div>
      </div>
    </T2Z7Frame>
  );
};
