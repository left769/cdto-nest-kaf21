import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StruckPill } from "../../../shared/StruckPill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z7Frame } from "../frame";
import { GLOSSARY } from "../script";

// Варіанти дій — розділ 4.2; випадки з прикладу — розділ 4 і еталонне проходження.
const OPTIONS = [
  { at: "v1", title: "Обхідне рішення", detail: "тимчасова заміна, ручний процес" },
  { at: "v2", title: "Перепланування", detail: "зсув залежних робіт, інша послідовність" },
  { at: "v3", title: "Ескалація", detail: "до рівня, що вплине на іншу сторону" },
  { at: "v4", title: "Альтернатива", detail: "інше джерело чи постачальник (підрядник)" },
];
const CASES = [
  { at: "apiFile", sign: "API кадрової системи не готове вчасно", actions: ["тимчасовий обмін файлом", "ескалація до власника системи"] },
  { at: "zi", sign: "Затримується погодження ЗІ", actions: ["ранній старт узгодження", "ескалація"] },
];

export const S4PlanB: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z7Frame timing={timing} current={3} done={3}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("risk") - 22}
        index={3}
        count={GLOSSARY.length}
        title="План Б"
        uk="дії при невиконанні залежності"
      />

      {/* Ризик і чотири варіанти */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("risk") - 4, cue("example") - 10) }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 150 }}>
          <Card accent={C.bad} style={{ padding: "22px 40px 26px 32px" }}>
            <div style={{ fontSize: F.body, fontWeight: 700 }}>Кожна зовнішня залежність — ризик</div>
            <div style={{ fontSize: F.small, color: C.muted, marginTop: 4 }}>інша сторона може не встигнути або не виконати</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 120, top: 346, ...fadeUp(frame, cue("ahead") - 4) }}>
          <Label>Для критичних — заздалегідь, як contingency</Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 414, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {OPTIONS.map((o) => (
            <div key={o.at} style={fadeUp(frame, cue(o.at) - 4)}>
              <Card accent={C.gold} style={{ padding: "20px 32px 24px 28px", height: 240, boxSizing: "border-box" }}>
                <div style={{ fontSize: 56, fontWeight: 700 }}>{o.title}</div>
                <div style={{ fontSize: F.small, color: C.muted, lineHeight: 1.2, marginTop: 6 }}>{o.detail}</div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Наш приклад */}
      <div style={{ position: "absolute", inset: 0, ...fadeUp(frame, cue("example") - 4) }}>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <Label>Наш приклад</Label>
        </div>
        {CASES.map((c, i) => (
          <div key={c.at} style={{ position: "absolute", left: 120, right: 120, top: 230 + i * 270, display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ width: 600, flexShrink: 0, ...fadeUp(frame, cue(c.at) - 30) }}>
              <Card accent={C.bad} style={{ padding: "22px 32px 26px 28px", height: 240, boxSizing: "border-box", display: "flex", alignItems: "center" }}>
                <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.15 }}>{c.sign}</div>
              </Card>
            </div>
            <svg width={60} height={40} style={{ flexShrink: 0, opacity: prog(frame, cue(c.at) - 4, 8) }}>
              <path d="M0 20 H48 M32 4 L54 20 L32 36" fill="none" stroke={C.gold} strokeWidth={6} />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
              {c.actions.map((a, k) => (
                <div key={a} style={fadeUp(frame, cue(c.at) + k * 20, { dx: -24, dy: 0 })}>
                  <Pill tone={k === 0 ? "gold" : "dark"} size={F.small}>
                    {a}
                  </Pill>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 120, top: 790, display: "flex", alignItems: "center", gap: 28, ...fadeUp(frame, cue("timely") - 4) }}>
          <Pill tone="ok" size={F.small}>
            ескалювати вчасно
          </Pill>
          <StruckPill strike={prog(frame, cue("timely") + 30, 14)}>коли час уже втрачено</StruckPill>
        </div>
      </div>
    </T2Z7Frame>
  );
};
