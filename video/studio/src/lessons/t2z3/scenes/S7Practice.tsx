import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fadeUp, prog } from "../../../shared/anim";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { LESSON_LABEL, SceneProps, T2Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Чек-лист вправи (бриф 4, сцена 7; зошит крок 3, чек-лист самоперевірки).
const ITEMS = [
  { cue: "kpi", title: "4–6 KPI", detail: "≥ 2 leading і ≥ 2 lagging · база, ціль, джерело, рішення" },
  { cue: "dashboard", title: "Дашборд", detail: "4 блоки · кожен веде до дії" },
  { cue: "raid", title: "RAID-log", detail: "≥ 2 записи R, A, I, D · у кожного власник" },
  { cue: "logs", title: "Decision / action log", detail: "відповідальний і строк" },
];

const Check: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width={72} height={72} viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
    <rect x={3} y={3} width={66} height={66} fill={C.card} stroke={C.ink} strokeWidth={5} />
    <path
      d="M16 37 L30 51 L57 21"
      fill="none"
      stroke={C.gold}
      strokeWidth={10}
      strokeLinecap="square"
      strokeDasharray={64}
      strokeDashoffset={64 * (1 - progress)}
    />
  </svg>
);

export const S7Practice: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const final = prog(frame, cue("template") - 6, 16);

  return (
    <T2Z3Frame timing={timing} current={null} done={GLOSSARY.length}>
      <div style={{ position: "absolute", left: 120, top: 140, fontSize: F.big, fontWeight: 700, ...fadeUp(frame, 0) }}>
        На практичному занятті
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 262, display: "flex", flexDirection: "column", gap: 26 }}>
        {ITEMS.map((item) => (
          <div key={item.cue} style={{ display: "flex", gap: 40, alignItems: "flex-start", ...fadeUp(frame, cue(item.cue) - 6) }}>
            <Check progress={prog(frame, cue(item.cue) + 6, 12)} />
            <div>
              <div style={{ fontSize: F.body, fontWeight: 700, lineHeight: 1.1 }}>{item.title}</div>
              <div style={{ fontSize: F.small, color: C.muted, marginTop: 8 }}>{item.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Фінальна картка */}
      <AbsoluteFill style={{ background: C.black, color: C.onDark, opacity: final, height: 940 }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 190, ...fadeUp(frame, cue("template") + 4) }}>
          <div style={{ fontSize: F.small, color: C.onDarkMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>Шаблон</div>
          <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 16 }}>
            Робочий зошит <span style={{ color: C.gold }}>→</span> Крок 3
          </div>
          <div style={{ fontSize: F.body, marginTop: 64 }}>cdto.ist.pp.ua</div>
          <div style={{ fontSize: F.small, color: C.onDarkMuted, marginTop: 20 }}>{LESSON_LABEL}</div>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, bottom: 56, fontSize: F.small, color: C.onDarkMuted, lineHeight: 1.3 }}>
          Озвучення: elevenlabs.io
          <br />
          Шрифт e-Ukraine © Мінцифри, CC BY 4.0
        </div>
      </AbsoluteFill>
    </T2Z3Frame>
  );
};
