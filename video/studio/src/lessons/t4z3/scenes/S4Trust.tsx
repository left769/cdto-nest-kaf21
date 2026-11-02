import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StruckCard } from "../../../shared/StruckCard";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T4Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Чому довіра критична — розділ 3.1 лекції; принципи — 3.2; відновлення — 3.3.
const PRINCIPLES = [
  { at: "p1", text: "чесність і прозорість" },
  { at: "p2", text: "виконання обіцянок" },
  { at: "p3", text: "компетентність" },
  { at: "p4", text: "повага до інтересів" },
  { at: "p5", text: "відкритість до зворотного зв’язку" },
];
const RECOVERY = [
  { at: "s1", text: "Відкрито визнати проблему" },
  { at: "s2", text: "Пояснити причину без виправдань" },
  { at: "s3", text: "Показати план виправлення" },
  { at: "s4", text: "Виконати й підтвердити результатом" },
];

// Сходи довіри: п’ять сходинок угору (по одній на принцип), потім обвал.
const STAIRS = { x0: 150, y0: 800, step: 150, rise: 104, dropX: 110, dropTo: 720 };

export const S4Trust: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  // Скільки сходинок уже збудовано (плавно) і наскільки довіра обвалилася.
  const built = PRINCIPLES.reduce((n, p) => n + prog(frame, cue(p.at) - 2, 12), 0);
  const drop = prog(frame, cue("broken") + 4, 8);
  const points: string[] = [`${STAIRS.x0},${STAIRS.y0}`];
  for (let i = 0; i < 5; i++) {
    const k = Math.min(1, Math.max(0, built - i));
    if (k <= 0) break;
    const x = STAIRS.x0 + i * STAIRS.step;
    const y = STAIRS.y0 - i * STAIRS.rise;
    points.push(`${x},${y - STAIRS.rise * k}`, `${x + STAIRS.step * k},${y - STAIRS.rise * k}`);
  }
  const top = { x: STAIRS.x0 + 5 * STAIRS.step, y: STAIRS.y0 - 5 * STAIRS.rise };
  const dropEnd = { x: top.x + STAIRS.dropX * drop, y: top.y + (STAIRS.dropTo - top.y) * drop };

  return (
    <T4Z3Frame timing={timing} current={3} done={3}>
      <TermCard frame={frame} at={0} outAt={cue("high") - 22} index={3} count={GLOSSARY.length} title="Довіра" uk="основа підтримки змін; будується діями" />

      {/* Висока і низька довіра */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 200, display: "flex", gap: 24, opacity: inOut(frame, cue("high") - 4, cue("actions") - 10) }}>
        <div style={{ flex: 1, ...fadeUp(frame, cue("high") - 2) }}>
          <Card accent={C.ok} style={{ padding: "28px 40px 34px 32px", height: 420, boxSizing: "border-box" }}>
            <Label>Висока довіра</Label>
            <div style={{ fontSize: F.body, fontWeight: 700, lineHeight: 1.15, marginTop: 18 }}>рішення швидше, підтримка навіть складних кроків</div>
          </Card>
        </div>
        <div style={{ flex: 1, ...fadeUp(frame, cue("low") - 2) }}>
          <Card accent={C.bad} style={{ padding: "28px 40px 34px 32px", height: 420, boxSizing: "border-box" }}>
            <Label>Низька довіра</Label>
            <div style={{ fontSize: F.body, fontWeight: 700, lineHeight: 1.15, marginTop: 18 }}>блокують навіть корисне</div>
          </Card>
        </div>
      </div>

      {/* Сходи довіри: будується довго, руйнується швидко */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("actions") - 4, cue("lost") - 10) }}>
        <div style={{ position: "absolute", left: 120, top: 150, fontSize: F.body, fontWeight: 700 }}>
          Діями, а не словами
        </div>
        <svg width={1920} height={940} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={STAIRS.x0} y1={STAIRS.y0 + 4} x2={top.x + STAIRS.dropX + 40} y2={STAIRS.y0 + 4} stroke={C.line} strokeWidth={4} />
          <polyline points={points.join(" ")} fill="none" stroke={C.gold} strokeWidth={10} strokeLinejoin="miter" />
          {drop > 0 ? <line x1={top.x} y1={top.y} x2={dropEnd.x} y2={dropEnd.y} stroke={C.bad} strokeWidth={10} /> : null}
        </svg>
        {/* Принципи праворуч: кожен додає сходинку */}
        <div
          style={{
            position: "absolute",
            left: 1080,
            width: 720,
            top: 230,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            opacity: 1 - prog(frame, cue("slow") - 4, 12),
          }}
        >
          {PRINCIPLES.map((p) => (
            <div key={p.at} style={{ display: "flex", gap: 20, fontSize: F.small, fontWeight: 700, lineHeight: 1.2, ...fadeUp(frame, cue(p.at) - 4, { dx: 24, dy: 0 }) }}>
              <div style={{ width: 22, height: 22, marginTop: 18, flexShrink: 0, background: C.gold }} />
              {p.text}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 1080, top: 300, ...fadeUp(frame, cue("slow") + 4) }}>
          <Pill tone="gold" size={F.body}>
            будується довго
          </Pill>
        </div>
        <div style={{ position: "absolute", left: 1080, top: 460, ...fadeUp(frame, cue("fast") - 2) }}>
          <Pill tone="bad" size={F.body}>
            руйнується швидко
          </Pill>
          <div style={{ fontSize: F.small, color: C.muted, marginTop: 16, ...fadeUp(frame, cue("broken") - 2) }}>одна невиконана обіцянка</div>
        </div>
      </div>

      {/* Відновлення довіри */}
      <div style={{ position: "absolute", inset: 0, opacity: prog(frame, cue("lost") - 4, 12) }}>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <Label>Якщо довіру втрачено</Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 220, display: "flex", flexDirection: "column", gap: 12 }}>
          {RECOVERY.map((s, i) => (
            <div key={s.at} style={fadeUp(frame, cue(s.at) - 4, { dx: -24, dy: 0 })}>
              <Card accent={C.ok} style={{ height: 92, boxSizing: "border-box", padding: "0 32px 0 28px", display: "flex", alignItems: "center", gap: 28 }}>
                <div style={{ width: 40, fontSize: F.small, fontWeight: 700, color: C.ok }}>{i + 1}</div>
                <div style={{ fontSize: F.body, fontWeight: 700 }}>{s.text}</div>
              </Card>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, top: 680, display: "flex", alignItems: "center", gap: 32, ...fadeUp(frame, cue("silent") - 4) }}>
          <StruckCard strike={prog(frame, cue("silent") + 12, 14)}>замовчати</StruckCard>
          <div style={{ fontSize: F.body, fontWeight: 700, color: C.bad }}>лише поглиблює недовіру</div>
        </div>
      </div>
    </T4Z3Frame>
  );
};
