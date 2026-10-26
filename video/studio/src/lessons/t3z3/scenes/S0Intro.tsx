import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T3Z3Frame } from "../frame";

// Процес «Інвентаризація майна» в AS-IS — Додаток 7 заняття; 8% — рішення автора (бриф, розділ 2).
const JOURNALS = ["Журнал 1", "Журнал 2", "Журнал 3"];
const STEPS = ["як є", "де втрати", "як має бути", "що змінити"];

const Journal: React.FC<{ label: string; scale?: number }> = ({ label, scale = 1 }) => (
  <div
    style={{
      width: 340 * scale,
      height: 92 * scale,
      boxSizing: "border-box",
      background: C.card,
      border: `2px solid ${C.line}`,
      borderLeft: `${12 * scale}px solid ${C.dim}`,
      display: "flex",
      alignItems: "center",
      paddingLeft: 24 * scale,
      fontSize: F.small * scale,
      fontWeight: 700,
      color: C.ink,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </div>
);

const Arrow: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg width={80} height={40} style={{ opacity, flexShrink: 0 }}>
    <path d="M0 20 H66 M48 4 L72 20 L48 36" fill="none" stroke={C.gold} strokeWidth={6} />
  </svg>
);

export const S0Intro: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const strip = prog(frame, cue("concepts"), 18);

  return (
    <T3Z3Frame timing={timing} dark current={null} done={0} glossaryStyle={{ opacity: strip, translate: `0px ${(1 - strip) * 140}px` }}>
      {/* AS-IS: журнали → ручне звіряння → 3 дні, 8% */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("days") - 6, cue("copy") - 8) }}>
        <div style={{ position: "absolute", left: 120, top: 220, display: "flex", flexDirection: "column", gap: 18 }}>
          {JOURNALS.map((j, i) => (
            <div key={j} style={fadeUp(frame, cue("journals") + i * 8, { dx: -24, dy: 0 })}>
              <Journal label={j} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 490, top: 340 }}>
          <Arrow opacity={prog(frame, cue("manual") - 4, 10)} />
        </div>
        <div style={{ position: "absolute", left: 600, top: 250, width: 680, ...fadeUp(frame, cue("manual") - 2) }}>
          <Card style={{ padding: "28px 40px 32px" }}>
            <Label>Комісія</Label>
            <div style={{ fontSize: F.body, fontWeight: 700, marginTop: 8, whiteSpace: "nowrap" }}>ручне звіряння</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 600, top: 480, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={fadeUp(frame, cue("days") - 4)}>
            <Pill tone="gold" size={F.body}>
              3 дні
            </Pill>
          </div>
          <div style={fadeUp(frame, cue("gap") - 4)}>
            <Pill tone="bad" size={F.body}>
              8% розбіжностей
            </Pill>
          </div>
        </div>
        <div style={{ position: "absolute", left: 600, top: 600, fontSize: F.small, color: C.onDarkMuted, ...fadeUp(frame, cue("gap") + 10) }}>
          облік ≠ факт
        </div>
      </div>

      {/* Той самий процес у комп’ютері */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("copy") - 4, cue("title") - 12) }}>
        <div
          style={{
            position: "absolute",
            left: 420,
            top: 180,
            width: 1080,
            height: 460,
            boxSizing: "border-box",
            border: `10px solid ${C.onDarkMuted}`,
            borderRadius: 18,
            background: C.graphite,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {JOURNALS.map((j) => (
              <Journal key={j} label={j} scale={0.8} />
            ))}
          </div>
          <Arrow opacity={1} />
          <div style={{ fontSize: F.body, fontWeight: 700, color: C.onDark }}>ручне звіряння</div>
        </div>
        <div style={{ position: "absolute", left: 870, width: 180, top: 640, height: 40, background: C.onDarkMuted }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", gap: 28, ...fadeUp(frame, cue("same") - 4) }}>
          <Pill tone="bad" size={F.body}>
            ті самі 3 дні
          </Pill>
          <div style={{ fontSize: F.body, color: C.onDarkMuted, alignSelf: "center" }}>— тільки в системі</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", justifyContent: "center", gap: 18 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={fadeUp(frame, cue("steps") + i * 10)}>
              <Pill tone="gold" size={F.small}>
                {s}
              </Pill>
            </div>
          ))}
        </div>
      </div>

      {/* Назва ролика */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 170, ...fadeUp(frame, cue("title")) }}>
        <div style={{ fontSize: F.head, fontWeight: 700, lineHeight: 1.1 }}>Аналіз AS-IS / TO-BE:</div>
        <div style={{ fontSize: F.big, fontWeight: 400, marginTop: 24, color: C.onDark }}>
          <span style={{ color: C.gold, fontWeight: 700 }}>6 понять</span> для практичного заняття
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 520, ...fadeUp(frame, cue("title") + 24) }}>
        <Card accent={C.gold} style={{ padding: "40px 64px 48px 56px", width: 1400 }}>
          <Label>Приклад</Label>
          <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 12 }}>Інвентаризація майна</div>
          <div style={{ fontSize: F.small, color: C.muted, marginTop: 16 }}>3 паперові журнали · 3 дні · 8% розбіжностей</div>
        </Card>
      </div>
    </T3Z3Frame>
  );
};
