import React from "react";
import { AbsoluteFill } from "remotion";
import { fadeUp, prog } from "./anim";
import { C, F } from "./theme";

export type PracticeItem = { cue: string; title: string; detail: string };

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

/**
 * Фінальна картка уроку: куди йти далі («Робочий зошит → Крок 3», «Текст заняття → Додатки 1–5»),
 * адреса сайту, мітка заняття й атрибуція голосу та шрифту. З’являється на кадрі `at`.
 */
export const FinalCard: React.FC<{ frame: number; at: number; label: string; from: string; to: string; lessonLabel: string }> = ({
  frame,
  at,
  label,
  from,
  to,
  lessonLabel,
}) => (
  <AbsoluteFill style={{ background: C.black, color: C.onDark, opacity: prog(frame, at - 6, 16), height: 940 }}>
    <div style={{ position: "absolute", left: 120, right: 120, top: 190, ...fadeUp(frame, at + 4) }}>
      <div style={{ fontSize: F.small, color: C.onDarkMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 16 }}>
        {from} <span style={{ color: C.gold }}>→</span> {to}
      </div>
      <div style={{ fontSize: F.body, marginTop: 64 }}>cdto.ist.pp.ua</div>
      <div style={{ fontSize: F.small, color: C.onDarkMuted, marginTop: 20 }}>{lessonLabel}</div>
    </div>
    <div style={{ position: "absolute", left: 120, right: 120, bottom: 56, fontSize: F.small, color: C.onDarkMuted, lineHeight: 1.3 }}>
      Озвучення: elevenlabs.io
      <br />
      Шрифт e-Ukraine © Мінцифри, CC BY 4.0
    </div>
  </AbsoluteFill>
);

/**
 * Остання сцена уроку: чек-лист вправи, пункти з’являються на своїх якорях,
 * потім фінальна картка з кроком зошита, адресою сайту й атрибуцією.
 */
export const Practice: React.FC<{
  frame: number;
  cue: (name: string) => number;
  items: PracticeItem[];
  step: string;
  lessonLabel: string;
  /** Щільніше компонування для 5 пунктів (4 вміщуються у звичайному). */
  compact?: boolean;
}> = ({ frame, cue, items, step, lessonLabel, compact = false }) => {
  return (
    <>
      <div style={{ position: "absolute", left: 120, top: compact ? 130 : 140, fontSize: compact ? F.body : F.big, fontWeight: 700, ...fadeUp(frame, 0) }}>
        На практичному занятті
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: compact ? 228 : 262,
          display: "flex",
          flexDirection: "column",
          gap: compact ? 14 : 26,
        }}
      >
        {items.map((item) => (
          <div key={item.cue} style={{ display: "flex", gap: 40, alignItems: "flex-start", ...fadeUp(frame, cue(item.cue) - 6) }}>
            <Check progress={prog(frame, cue(item.cue) + 6, 12)} />
            <div>
              <div style={{ fontSize: compact ? 60 : F.body, fontWeight: 700, lineHeight: 1.1 }}>{item.title}</div>
              <div style={{ fontSize: F.small, color: C.muted, marginTop: compact ? 4 : 8, lineHeight: compact ? 1.15 : undefined }}>
                {item.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      <FinalCard frame={frame} at={cue("template")} label="Шаблон" from="Робочий зошит" to={step} lessonLabel={lessonLabel} />
    </>
  );
};
