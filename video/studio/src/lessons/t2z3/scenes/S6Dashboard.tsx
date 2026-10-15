import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeOut, fadeUp, inOut, prog } from "../../../shared/anim";
import { Bubble } from "../../../shared/Bubble";
import { Card, Label } from "../../../shared/Card";
import { cellCenter } from "../../../shared/GlossaryStrip";
import { Pill } from "../../../shared/Pill";
import { Letter } from "../../../shared/RiskLetter";
import { TermCard } from "../../../shared/TermCard";
import { TrafficLight } from "../../../shared/TrafficLight";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Сітка 2×2 у робочій зоні над смугою глосарію.
const GRID = { left: 120, top: 140, w: 828, h: 380, gap: 24 };
const blockPos = (i: number) => ({
  left: GRID.left + (i % 2) * (GRID.w + GRID.gap),
  top: GRID.top + Math.floor(i / 2) * (GRID.h + GRID.gap),
});

/** Елемент прилітає з комірки смуги глосарію на своє місце в дашборді. */
const FlyIn: React.FC<{ frame: number; at: number; cell: number; to: { x: number; y: number }; children: React.ReactNode }> = ({
  frame,
  at,
  cell,
  to,
  children,
}) => {
  const t = prog(frame, at, 24, EASE_IN_OUT);
  const from = cellCenter(cell, GLOSSARY.length);
  return (
    <div
      style={{
        opacity: prog(frame, at, 6),
        translate: `${(from.x - to.x) * (1 - t)}px ${(from.y - to.y) * (1 - t)}px`,
        scale: String(0.5 + 0.5 * t),
      }}
    >
      {children}
    </div>
  );
};

// Дашборд «Системи обліку майна» на середину реалізації (Додаток 7).
const BLOCKS = [
  { title: "Статус", cue: "status", action: "Ескалувати погодження", actionCue: "a1" },
  { title: "Строки", cue: "schedule", action: "Перерозподілити ресурс", actionCue: "a2" },
  { title: "Результат", cue: "result", action: "Посилити навчання", actionCue: "a3" },
  { title: "Ризики", cue: "risks", action: "Опрацювати з власниками", actionCue: "a4" },
];

// «Вітрина»: двадцять цифр без жодного рішення (навмисно беззмістовні).
const NOISE = ["128", "3,4", "76%", "12", "0,91", "540", "18%", "7", "2,3", "61", "93%", "4", "1,7", "305", "27%", "88", "0,62", "15", "44%", "9"];

export const S6Dashboard: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cueBase = cueOf(timing);
  // Четверта дія не звучить окремо — з’являється слідом за третьою.
  const cue = (name: string) => (name === "a4" ? cueBase("a3") + 40 : cueBase(name));
  const showcase = inOut(frame, cue("showcase") - 6, cue("answer") - 12);
  const grid = fadeOut(frame, cue("showcase") - 8);

  const indicator = (i: number): React.ReactNode => {
    const p = blockPos(i);
    switch (i) {
      case 0:
        return (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <TrafficLight state="yellow" size={40} />
              <div style={{ fontSize: F.body, fontWeight: 700, lineHeight: 1.1 }}>Жовтий</div>
            </div>
            <div style={{ fontSize: F.small, color: C.muted, lineHeight: 1.15, marginTop: 10, whiteSpace: "nowrap" }}>
              віха «погодження ТЗ»
              <br />
              під загрозою
            </div>
          </div>
        );
      case 1:
        return (
          <FlyIn frame={frame} at={cue("schedule") + 6} cell={2} to={{ x: p.left + 180, y: p.top + 190 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <Pill tone="bad" size={F.big}>
                SPI 0,8
              </Pill>
              <div style={{ fontSize: F.small, color: C.muted, lineHeight: 1.15 }}>
                {"< 1"}
                <br />
                відставання
              </div>
            </div>
          </FlyIn>
        );
      case 2:
        return (
          <div>
            <div style={{ fontSize: F.small, color: C.ink, fontWeight: 500 }}>Adoption пілоту</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 4 }}>
              <div style={{ fontSize: F.big, fontWeight: 700, lineHeight: 1.1 }}>45%</div>
              <div style={{ fontSize: F.small, color: C.muted }}>ціль 90%</div>
            </div>
            <div style={{ position: "relative", height: 22, background: C.warm, marginTop: 14, width: 740 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${45 * prog(frame, cue("result") + 10, 24, EASE_IN_OUT)}%`,
                  background: C.graphite,
                }}
              />
              <div style={{ position: "absolute", left: "90%", top: -10, bottom: -10, width: 6, background: C.gold }} />
            </div>
          </div>
        );
      default:
        return (
          <FlyIn frame={frame} at={cue("risks") + 6} cell={3} to={{ x: p.left + 100, y: p.top + 190 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <Letter letter="R" size={96} />
              <div style={{ fontSize: F.body, fontWeight: 700 }}>2 критичні</div>
            </div>
          </FlyIn>
        );
    }
  };

  return (
    <T2Z3Frame timing={timing} current={5} done={5}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("four") - 22}
        index={5}
        count={GLOSSARY.length}
        title="Dashboard"
        uk="дашборд"
      />

      {/* Чотири блоки, кожен веде до дії */}
      <div style={{ position: "absolute", inset: 0, opacity: grid * fadeOut(frame, cue("answer") - 12) }}>
        {BLOCKS.map((b, i) => {
          const p = blockPos(i);
          const band = prog(frame, cue("main"), 12);
          return (
            <div
              key={b.title}
              style={{
                position: "absolute",
                left: p.left,
                top: p.top,
                width: GRID.w,
                height: GRID.h,
                opacity: prog(frame, cue("four") + i * 5, 10) * (0.35 + 0.65 * prog(frame, cue(b.cue) - 4, 10)),
              }}
            >
              <Card style={{ height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "26px 36px 0" }}>
                  <Label>{b.title}</Label>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 36px", ...fadeUp(frame, cue(b.cue) - 2) }}>
                  {indicator(i)}
                </div>
                {/* Дія: золота смуга зі стрілкою */}
                <div
                  style={{
                    height: 84,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "0 24px",
                    background: `rgba(243, 146, 0, ${band})`,
                    borderTop: `2px solid ${C.line}`,
                  }}
                >
                  <svg width={40} height={36} style={{ flexShrink: 0, opacity: band }}>
                    <path d="M0 18 H32 M20 4 L36 18 L20 32" fill="none" stroke={C.ink} strokeWidth={6} />
                  </svg>
                  <div
                    style={{
                      fontSize: F.small,
                      fontWeight: 700,
                      color: C.ink,
                      whiteSpace: "nowrap",
                      ...fadeUp(frame, cue(b.actionCue) - 4, { dx: -24, dy: 0 }),
                    }}
                  >
                    {b.action}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Контраст: «вітрина» з двадцятьма цифрами, перекреслена */}
      <div style={{ position: "absolute", left: 120, top: 140, width: 1680, height: 784, opacity: showcase }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, height: "100%" }}>
          {NOISE.map((n, i) => (
            <div
              key={i}
              style={{
                background: C.card,
                border: `2px solid ${C.line}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                color: C.dim,
                ...fadeUp(frame, cue("showcase") - 6 + (i % 7) * 2, { dy: 16 }),
              }}
            >
              <div style={{ fontSize: F.body, fontWeight: 700 }}>{n}</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 30 }}>
                {[0.4, 0.9, 0.6, 1, 0.7].map((h, k) => (
                  <div key={k} style={{ width: 14, height: 30 * ((h * (i + 3) * (k + 2)) % 1 || h), background: C.line }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <svg width={1680} height={784} style={{ position: "absolute", inset: 0 }}>
          {[
            [40, 40, 1640, 744],
            [1640, 40, 40, 744],
          ].map(([x1, y1, x2, y2], k) => {
            const t = prog(frame, cue("showcase") + 30 + k * 8, 14);
            return (
              <line
                key={k}
                x1={x1}
                y1={y1}
                x2={x1 + (x2 - x1) * t}
                y2={y1 + (y2 - y1) * t}
                stroke={C.bad}
                strokeWidth={16}
                strokeLinecap="round"
                opacity={t > 0 ? 1 : 0}
              />
            );
          })}
        </svg>
        <div style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%" }}>
          <div style={fadeUp(frame, cue("showcase") + 50)}>
            <Pill tone="bad" size={F.big}>
              вітрина, а не інструмент
            </Pill>
          </div>
        </div>
      </div>

      {/* Відповідь командиру */}
      <div style={{ position: "absolute", left: 120, top: 170, ...fadeUp(frame, cue("answer")) }}>
        <Label style={{ marginBottom: 20 }}>Командир</Label>
        <Bubble side="left" tone="light" style={{ fontSize: F.big, fontWeight: 500 }}>
          Як справи з проєктом?
        </Bubble>
      </div>
      <div style={{ position: "absolute", right: 120, top: 470, ...fadeUp(frame, cue("answer") + 24) }}>
        <Label style={{ marginBottom: 20, textAlign: "right" }}>Ви</Label>
        <Bubble side="right" tone="dark" style={{ fontSize: F.body, fontWeight: 500 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 36, maxWidth: 1300 }}>
            <TrafficLight state="yellow" size={36} />
            <div>Статус жовтий, відстаємо, потрібне рішення щодо погодження ТЗ.</div>
          </div>
        </Bubble>
      </div>
    </T2Z3Frame>
  );
};
