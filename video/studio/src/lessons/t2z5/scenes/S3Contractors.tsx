import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StepChain } from "../../../shared/StepChain";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z5Frame } from "../frame";
import { GLOSSARY } from "../script";

// Договірні захисти (розділ 3) і експерти (розділ 4).
const PROTECTIONS = [
  ["p1", "Права на код і документацію або ескроу"],
  ["p2", "Незалежний аудит безпеки"],
  ["p3", "SLA на підтримку"],
  ["p4", "Приймальні критерії якості"],
] as const;
const EXPERTS = [
  ["e1", "юридичний"],
  ["e2", "безпековий"],
  ["e3", "закупівельний"],
] as const;

const Tick: React.FC<{ on: number }> = ({ on }) => (
  <svg width={48} height={48} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <rect x={2} y={2} width={44} height={44} fill="none" stroke={C.line} strokeWidth={4} />
    <path d="M10 25 L20 35 L39 13" fill="none" stroke={C.ok} strokeWidth={8} strokeLinecap="square" opacity={on} />
  </svg>
);

export const S3Contractors: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const lock = prog(frame, cue("lockin") - 4, 12);

  return (
    <T2Z5Frame timing={timing} current={2} done={2}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("own") - 22}
        index={2}
        count={GLOSSARY.length}
        title="Vendor lock-in"
        uk="залежність від постачальника"
      />

      {/* Наказ і договір; захисти в договорі; кейс 2 */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("own") - 4, cue("experts") - 8) }}>
        <div style={{ position: "absolute", left: 120, top: 150, width: 820, ...fadeUp(frame, cue("own") - 4) }}>
          <Card accent={C.graphite} style={{ padding: "22px 36px" }}>
            <Label>Власна команда</Label>
            <div style={{ fontSize: 56, fontWeight: 700, marginTop: 6 }}>керують наказом</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 980, top: 150, width: 820, ...fadeUp(frame, cue("contract") - 4) }}>
          <Card accent={C.gold} style={{ padding: "22px 36px" }}>
            <Label>Підрядник</Label>
            <div style={{ fontSize: 56, fontWeight: 700, marginTop: 6 }}>керують через договір</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 120, top: 340, width: 1680, ...fadeUp(frame, cue("protections") - 4) }}>
          <Card style={{ padding: "20px 36px 24px" }}>
            <Label>ТЗ і договір — заздалегідь</Label>
            {PROTECTIONS.map(([at, text]) => (
              <div key={at} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12, opacity: prog(frame, cue(at) - 4, 8) }}>
                <Tick on={prog(frame, cue(at), 8) * (1 - lock)} />
                <div style={{ fontSize: F.small, fontWeight: 500, color: lock > 0.5 ? C.dim : C.ink, textDecoration: lock > 0.5 ? "line-through" : "none" }}>
                  {text}
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div style={{ position: "absolute", left: 120, top: 720, display: "flex", alignItems: "center", gap: 32, ...fadeUp(frame, cue("lockin") - 4) }}>
          <Label>Кейс 2 · без цього</Label>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20, ...fadeUp(frame, cue("price") - 4) }}>
            <div style={{ fontSize: F.head, fontWeight: 700, color: C.bad, lineHeight: 1 }}>×2</div>
            <div style={{ fontSize: F.body, fontWeight: 500 }}>ціна підтримки</div>
          </div>
          <Pill tone="bad" size={F.body}>
            lock-in
          </Pill>
        </div>
      </div>

      {/* Експерти — на етапі ТЗ */}
      <div style={{ position: "absolute", inset: 0, opacity: prog(frame, cue("experts") - 4, 12) }}>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <Label>Профільні експерти</Label>
        </div>
        <div style={{ position: "absolute", left: 120, top: 560 }}>
          <StepChain
            frame={frame}
            steps={[
              { label: "Ініціювання", at: cue("experts") },
              { label: "ТЗ", at: cue("experts") + 6, activeFrom: cue("tz") - 4 },
              { label: "Договір", at: cue("experts") + 12 },
              { label: "Впровадження", at: cue("experts") + 18 },
            ]}
          />
        </div>
        <div style={{ position: "absolute", left: 470, top: 215, display: "flex", flexDirection: "column", gap: 14 }}>
          {EXPERTS.map(([at, label]) => (
            <div key={at} style={fadeUp(frame, cue(at) - 4, { dy: -24 })}>
              <Pill tone="dark" size={F.small}>
                {label}
              </Pill>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, top: 700, ...fadeUp(frame, cue("cheaper") - 4) }}>
          <Pill tone="gold" size={F.small}>
            раннє залучення дешевше за пізнє виправлення
          </Pill>
        </div>
      </div>
    </T2Z5Frame>
  );
};
