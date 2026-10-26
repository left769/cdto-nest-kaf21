import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StruckCard } from "../../../shared/StruckCard";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T3Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Принципи — розділ 2.2; вдосконалення / реінжиніринг — 2.3; критерії — 2.4; потік TO-BE — зразок кроку зошита.
const PRINCIPLES = [
  { at: "p1", text: "прибрати зайві кроки й дублювання" },
  { at: "p2", text: "автоматизувати рутину" },
  { at: "p3", text: "розпаралелити" },
  { at: "p4", text: "скоротити погодження й очікування" },
  { at: "p5", text: "єдине джерело даних" },
];
const FLOW = [
  { at: "registry", who: "Система", text: "Єдиний реєстр" },
  { at: "commission", who: "Комісія", text: "Вносить фактичну кількість" },
  { at: "check", who: "Система", text: "Одразу звіряє з обліком" },
  { at: "act", who: "Система", text: "Формує акт розбіжностей" },
  { at: "approve", who: "Командир", text: "Затверджує в системі" },
];
const LIMITS = ["нормативи", "вимоги ЗІ", "ресурси"];

export const S5ToBe: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T3Z3Frame timing={timing} current={4} done={4}>
      <TermCard frame={frame} at={0} outAt={cue("not") - 22} index={4} count={GLOSSARY.length} title="TO-BE" uk="процес «як має бути»" />

      {/* Не автоматизований AS-IS, а перепроєктований процес */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("not") - 4, cue("ours") - 10) }}>
        <div style={{ position: "absolute", left: 120, top: 160 }}>
          <StruckCard strike={prog(frame, cue("not") + 20, 14)}>автоматизований AS-IS</StruckCard>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 380 }}>
          <Label>Перепроєктувати</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 16 }}>
            {PRINCIPLES.map((p) => (
              <div key={p.at} style={fadeUp(frame, cue(p.at) - 4)}>
                <Pill tone={p.at === "p5" ? "gold" : "ghost"} size={F.small}>
                  {p.text}
                </Pill>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Потік TO-BE і цільові метрики */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("ours") - 4, cue("reeng") - 10) }}>
        <div style={{ position: "absolute", left: 120, top: 160 }}>
          <Label>Інвентаризація · TO-BE</Label>
        </div>
        {/* Як таблиця TO-BE у зошиті: крок — учасник — дія; система виділена золотим. */}
        <div style={{ position: "absolute", left: 120, right: 120, top: 220, display: "flex", flexDirection: "column", gap: 10 }}>
          {FLOW.map((f, i) => (
            <div key={f.at} style={fadeUp(frame, cue(f.at) - 4, { dx: -24, dy: 0 })}>
              <Card
                accent={f.who === "Система" ? C.gold : C.graphite}
                style={{ padding: "0 28px 0 24px", height: 64, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 28 }}
              >
                <div style={{ width: 40, fontSize: F.small, fontWeight: 700, color: C.gold }}>{i + 1}</div>
                <div style={{ width: 300, flexShrink: 0, fontSize: F.small, fontWeight: 700, color: f.who === "Система" ? C.gold : C.muted }}>{f.who}</div>
                <div style={{ fontSize: F.small, fontWeight: 700 }}>{f.text}</div>
              </Card>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 620, display: "flex", gap: 24, ...fadeUp(frame, cue("metrics") - 4) }}>
          {[
            ["Час інвентаризації", "3 дні", "≤ 1 дня"],
            ["Розбіжності", "8%", "≤ 3%"],
          ].map(([name, from, to]) => (
            <div key={name} style={{ flex: 1 }}>
              <Card accent={C.ok} style={{ padding: "20px 32px 24px", height: 210, boxSizing: "border-box" }}>
                <Label>{name}</Label>
                <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 14, whiteSpace: "nowrap" }}>
                  <span style={{ color: C.muted }}>{from}</span> <span style={{ color: C.gold }}>→</span> {to}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Вдосконалення чи реінжиніринг; реалістичність */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 160, display: "flex", gap: 24 }}>
        <div style={{ flex: 1, ...fadeUp(frame, cue("reeng") - 4) }}>
          <Card accent={C.bad} style={{ padding: "24px 36px 30px", height: 300, boxSizing: "border-box" }}>
            <div style={{ fontSize: F.body, fontWeight: 700 }}>Реінжиніринг</div>
            <div style={{ fontSize: F.small, color: C.muted, lineHeight: 1.2, marginTop: 10 }}>процес принципово неефективний — переосмислити з нуля</div>
          </Card>
        </div>
        <div style={{ flex: 1, ...fadeUp(frame, cue("improve") - 4) }}>
          <Card accent={C.ok} style={{ padding: "24px 36px 30px", height: 300, boxSizing: "border-box" }}>
            <div style={{ fontSize: F.body, fontWeight: 700 }}>Вдосконалення</div>
            <div style={{ fontSize: F.small, color: C.muted, lineHeight: 1.2, marginTop: 10 }}>процес загалом робочий — покращувати поступово</div>
          </Card>
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 540, ...fadeUp(frame, cue("real") - 4) }}>
        <Label>Реалістичний TO-BE — у межах</Label>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          {LIMITS.map((l, i) => (
            <div key={l} style={fadeUp(frame, cue("real") + 10 + i * 8)}>
              <Pill tone="dark" size={F.body}>
                {l}
              </Pill>
            </div>
          ))}
        </div>
      </div>
    </T3Z3Frame>
  );
};
