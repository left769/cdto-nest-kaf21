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
import { DEP_TYPES, DepType } from "../types";

// Карта залежностей прикладу — розділ 1.4 заняття; критичний шлях — еталонне проходження.
const SIDES = ["робота", "система", "підрозділ", "рішення"];
const CARD_W = 480;
const CARD_H = 220;
const NODE = { left: 450, top: 460, width: 420, height: 120 };
const DEPS: { type: DepType; at: string; text: string; left: number; top: number; critical: boolean }[] = [
  { type: "tech", at: "tech", text: "API кадрової системи", left: 120, top: 160, critical: true },
  { type: "norm", at: "norm", text: "Погодження ЗІ", left: 840, top: 160, critical: true },
  { type: "org", at: "org", text: "Рішення про доступ", left: 120, top: 660, critical: false },
  { type: "res", at: "res", text: "Інтеграційний фахівець", left: 840, top: 660, critical: false },
];

/** Стрілка від картки залежності до результату; `grow` 0 → 1 — промальовка. */
const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; width: number; grow: number }> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  width,
  grow,
}) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={len} strokeDashoffset={len * (1 - grow)} />
      <polygon points="0,0 -26,-14 -26,14" fill={color} opacity={grow > 0.95 ? 1 : 0} transform={`translate(${x2} ${y2}) rotate(${angle})`} />
    </g>
  );
};

export const S1Map: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const critical = prog(frame, cue("path") - 4, 12);

  return (
    <T2Z7Frame timing={timing} current={0} done={0}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("dep") - 22}
        index={0}
        count={GLOSSARY.length}
        title="Dependency map"
        uk="карта залежностей"
      />

      {/* Що таке залежність і карта */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("dep") - 4, cue("types") - 10) }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 170 }}>
          <Card accent={C.gold} style={{ padding: "26px 40px 32px 32px" }}>
            <Label>Залежність</Label>
            <div style={{ fontSize: F.body, fontWeight: 700, marginTop: 8 }}>ваш результат залежить від іншої сторони</div>
            <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
              {SIDES.map((s, i) => (
                <div key={s} style={fadeUp(frame, cue("dep") + 30 + i * 8)}>
                  <Pill tone="ghost" size={F.small}>
                    {s}
                  </Pill>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 520, ...fadeUp(frame, cue("map") - 4) }}>
          <Card accent={C.graphite} style={{ padding: "26px 40px 32px 32px" }}>
            <Label>Dependency map</Label>
            <div style={{ fontSize: F.body, fontWeight: 700, lineHeight: 1.2, marginTop: 8 }}>
              від чого і від кого залежить кожен ключовий результат
            </div>
          </Card>
        </div>
      </div>

      {/* Карта прикладу */}
      <div style={{ position: "absolute", inset: 0, ...fadeUp(frame, cue("types") - 4) }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {DEPS.map((d) => {
            const fromX = d.left + CARD_W / 2;
            const fromY = d.top < NODE.top ? d.top + CARD_H : d.top;
            const toX = d.left < NODE.left ? NODE.left + 40 : NODE.left + NODE.width - 40;
            const toY = d.top < NODE.top ? NODE.top : NODE.top + NODE.height;
            const hot = d.critical ? critical : 0;
            return (
              <Arrow
                key={d.at}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                color={hot > 0.5 ? C.bad : C.graphite}
                width={hot > 0.5 ? 10 : 6}
                grow={prog(frame, cue(d.at) + 6, 14)}
              />
            );
          })}
        </svg>
        <div style={{ position: "absolute", ...NODE }}>
          <Card style={{ height: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", background: C.black }}>
            <div style={{ fontSize: 56, fontWeight: 700, color: C.onDark }}>Інтеграція</div>
          </Card>
        </div>
        {DEPS.map((d) => {
          const t = DEP_TYPES[d.type];
          const hot = d.critical ? critical : 0;
          return (
            <div key={d.at} style={{ position: "absolute", left: d.left, top: d.top, width: CARD_W, height: CARD_H, ...fadeUp(frame, cue(d.at) - 4) }}>
              <div
                style={{
                  height: "100%",
                  boxSizing: "border-box",
                  background: C.card,
                  border: `${hot > 0.5 ? 6 : 2}px solid ${hot > 0.5 ? C.bad : C.line}`,
                  borderLeft: `14px solid ${t.color}`,
                  padding: "18px 28px",
                }}
              >
                <div style={{ fontSize: F.small, fontWeight: 500, color: C.muted }}>{t.name}</div>
                <div style={{ fontSize: F.small, fontWeight: 700, lineHeight: 1.2, marginTop: 8 }}>{d.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Права колонка: напрям, критичність, типова помилка */}
      <div style={{ position: "absolute", left: 1360, right: 120, top: 160 }}>
        <div style={fadeUp(frame, cue("direction") - 4)}>
          <Label>Напрям</Label>
        </div>
        <div style={{ marginTop: 12, ...fadeUp(frame, cue("in") - 4) }}>
          <div style={{ fontSize: F.small, fontWeight: 700 }}>вхідна</div>
          <div style={{ fontSize: F.small, color: C.muted }}>ми чекаємо</div>
        </div>
        <div style={{ marginTop: 16, ...fadeUp(frame, cue("out") - 4) }}>
          <div style={{ fontSize: F.small, fontWeight: 700 }}>вихідна</div>
          <div style={{ fontSize: F.small, color: C.muted }}>чекають на нас</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1360, right: 120, top: 500, ...fadeUp(frame, cue("critical") - 4) }}>
        <Label>Критичність</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
          <div style={{ width: 56, height: 10, background: C.bad, flexShrink: 0 }} />
          <div style={{ fontSize: F.small, fontWeight: 700, lineHeight: 1.2 }}>
            критичний
            <br />
            шлях
          </div>
        </div>
        <div style={{ fontSize: F.small, color: C.muted, lineHeight: 1.2, marginTop: 10, ...fadeUp(frame, cue("path") + 10) }}>
          найпильніший
          <br />
          моніторинг
        </div>
      </div>
      <div style={{ position: "absolute", left: 1360, top: 840, ...fadeUp(frame, cue("mistake") - 4) }}>
        <StruckPill strike={prog(frame, cue("mistake") + 10, 14)}>лише технічні</StruckPill>
      </div>
    </T2Z7Frame>
  );
};
