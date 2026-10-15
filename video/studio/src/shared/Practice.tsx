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
  const final = prog(frame, cue("template") - 6, 16);
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

      {/* Фінальна картка */}
      <AbsoluteFill style={{ background: C.black, color: C.onDark, opacity: final, height: 940 }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 190, ...fadeUp(frame, cue("template") + 4) }}>
          <div style={{ fontSize: F.small, color: C.onDarkMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>Шаблон</div>
          <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 16 }}>
            Робочий зошит <span style={{ color: C.gold }}>→</span> {step}
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
    </>
  );
};
