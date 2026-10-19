import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StruckPill } from "../../../shared/StruckPill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z5Frame } from "../frame";
import { GLOSSARY } from "../script";

// Схема потоку: обмеження — погодження (типове для ЦТ ЗСУ, розділ 5).
const NODES = [
  { name: "Вимоги", x: 120, w: 250 },
  { name: "Погодження", x: 640, w: 360 },
  { name: "Розробка", x: 1050, w: 300 },
  { name: "Впровадження", x: 1400, w: 400 },
];
const QUEUE = 4;
const TYPICAL = [
  ["t1", "цикли погоджень"],
  ["t2", "дефіцит фахівців"],
  ["t3", "затримки фінансування й закупівель"],
] as const;
const FLOW_Y = 400;

export const S4Bottleneck: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const waiting = prog(frame, cue("waiting") - 4, 12);
  const relief = prog(frame, cue("actions"), 30);

  return (
    <T2Z5Frame timing={timing} current={3} done={3}>
      <TermCard frame={frame} at={0} outAt={cue("toc") - 22} index={3} count={GLOSSARY.length} title="Bottleneck" uk="вузьке місце" />

      <div style={{ position: "absolute", left: 120, top: 150, ...fadeUp(frame, cue("toc") - 4) }}>
        <Label>Швидкість проєкту визначає найвужча ланка</Label>
      </div>

      {/* Потік робіт */}
      <div style={{ position: "absolute", inset: 0, opacity: prog(frame, cue("toc"), 12) }}>
        {NODES.map((n, i) => {
          const isLimit = i === 1;
          const isWaiting = i > 1;
          return (
            <div key={n.name} style={{ position: "absolute", left: n.x, top: FLOW_Y, width: n.w, opacity: isWaiting ? 1 - 0.55 * waiting : 1 }}>
              <Card accent={isLimit ? C.bad : undefined} style={{ padding: "26px 24px", textAlign: "center" }}>
                <div style={{ fontSize: F.small, fontWeight: 700 }}>{n.name}</div>
              </Card>
              {isWaiting ? (
                <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: F.small, color: C.muted, opacity: waiting }}>
                  чекають
                </div>
              ) : null}
            </div>
          );
        })}
        {/* Черга перед обмеженням */}
        <div style={{ position: "absolute", left: 386, top: FLOW_Y + 26, display: "flex", gap: 12 }}>
          {Array.from({ length: QUEUE }, (_, k) => (
            <div
              key={k}
              style={{
                width: 52,
                height: 68,
                background: C.card,
                border: `3px solid ${C.bad}`,
                opacity: prog(frame, cue("queue") + k * 5, 8) * (1 - prog(frame, cue("actions") + k * 8, 10)),
              }}
            />
          ))}
        </div>
        <div style={{ position: "absolute", left: 386, top: FLOW_Y + 112, fontSize: F.small, color: C.bad, fontWeight: 700, opacity: prog(frame, cue("queue") + 10, 8) * (1 - relief) }}>
          черга
        </div>
      </div>

      {/* Ресурс — на обмеження */}
      <div style={{ position: "absolute", left: 750, top: 232, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, ...fadeUp(frame, cue("focus") - 4, { dy: -24 }) }}>
        <Pill tone="gold" size={F.small}>
          ресурс
        </Pill>
        <svg width={40} height={44}>
          <path d="M20 0 V36 M6 22 L20 40 L34 22" fill="none" stroke={C.gold} strokeWidth={6} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 1050, top: 232, ...fadeUp(frame, cue("notOthers") - 4, { dy: -24 }) }}>
        <StruckPill strike={prog(frame, cue("notOthers") + 8, 12)}>ресурс</StruckPill>
        <div style={{ fontSize: F.small, color: C.muted, marginTop: 10 }}>не прискорить</div>
      </div>

      {/* Типові обмеження й дії */}
      <div style={{ position: "absolute", left: 120, top: 590, ...fadeUp(frame, cue("typical") - 4) }}>
        <Label>Типові обмеження ЦТ ЗСУ</Label>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 642, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
        {TYPICAL.map(([at, label]) => (
          <div key={at} style={fadeUp(frame, cue(at) - 4, { dx: -16, dy: 0 })}>
            <Pill tone="dark" size={F.small}>
              {label}
            </Pill>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, top: 840, display: "flex", gap: 20, ...fadeUp(frame, cue("actions") - 4) }}>
        <Pill tone="gold" size={F.small}>
          додати людей
        </Pill>
        <Pill tone="gold" size={F.small}>
          спростити чи ескалувати погодження
        </Pill>
      </div>
    </T2Z5Frame>
  );
};
