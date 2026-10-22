import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { StepChain } from "../../../shared/StepChain";
import { StruckPill } from "../../../shared/StruckPill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z7Frame } from "../frame";
import { GLOSSARY } from "../script";

// Міжвідомчі залежності — розділ 2 заняття; склад письмової домовленості — розділ 2.3.
const PARTIES = ["Інші відомства", "Органи військового управління", "Суміжні системи"];
const AGREEMENT = [
  { at: "w1", text: "що саме надають" },
  { at: "w2", text: "до якого строку" },
  { at: "w3", text: "власники з обох боків" },
  { at: "w4", text: "формат і критерій прийняття" },
  { at: "w5", text: "канал і періодичність моніторингу" },
];

const Check: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width={56} height={56} viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
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

export const S2Interagency: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z7Frame timing={timing} current={1} done={1}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("deps") - 22}
        index={1}
        count={GLOSSARY.length}
        title="Міжвідомчі залежності"
        titleSize={F.head}
        uk="інша сторона живе за своїми правилами"
      />

      {/* Від кого залежимо */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("deps") - 4, cue("three") - 10) }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 170, display: "flex", gap: 24 }}>
          {PARTIES.map((p, i) => (
            <div key={p} style={{ flex: 1, ...fadeUp(frame, cue("deps") + 10 + i * 10) }}>
              <Card accent={C.graphite} style={{ padding: "26px 32px", height: 210, boxSizing: "border-box", display: "flex", alignItems: "center" }}>
                <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>{p}</div>
              </Card>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 440, ...fadeUp(frame, cue("others") - 4) }}>
          <Label>В іншої сторони — власні</Label>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {["пріоритети", "строки", "процедури"].map((t) => (
              <Pill key={t} tone="dark" size={F.body}>
                {t}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      {/* Три кроки */}
      <div style={{ position: "absolute", left: 120, top: 160, ...fadeUp(frame, cue("three") - 4) }}>
        <StepChain
          frame={frame}
          size={F.body}
          steps={[
            { label: "Виявлення", at: cue("three"), activeFrom: cue("find") - 4, activeTo: cue("plan") - 4 },
            { label: "Планування", at: cue("three") + 8, activeFrom: cue("plan") - 4, activeTo: cue("monitor") - 4 },
            { label: "Моніторинг", at: cue("three") + 16, activeFrom: cue("monitor") - 4 },
          ]}
        />
      </div>

      {/* Виявлення */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 330, opacity: inOut(frame, cue("find") - 4, cue("plan") - 10) }}>
        <Card accent={C.gold} style={{ padding: "30px 44px 38px 36px" }}>
          <Label>Під час планування — по кожному результату</Label>
          <div style={{ fontSize: F.big, fontWeight: 700, lineHeight: 1.15, marginTop: 14 }}>«Від кого чи чого він залежить?»</div>
        </Card>
      </div>

      {/* Планування: письмова домовленість */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 330, opacity: inOut(frame, cue("plan") - 4, cue("monitor") - 10) }}>
        <Card accent={C.gold} style={{ padding: "26px 44px 32px 36px" }}>
          <div style={fadeUp(frame, cue("written") - 4)}>
            <Label>Домовленість — письмово</Label>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
            {AGREEMENT.map((a) => (
              <div key={a.at} style={{ display: "flex", alignItems: "center", gap: 28, ...fadeUp(frame, cue(a.at) - 6, { dx: -24, dy: 0 }) }}>
                <Check progress={prog(frame, cue(a.at) + 4, 12)} />
                <div style={{ fontSize: F.small, fontWeight: 700 }}>{a.text}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Моніторинг */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 330, ...fadeUp(frame, cue("monitor") - 4) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Pill tone="gold" size={F.body}>
            RAID-log
          </Pill>
          <div style={{ fontSize: F.body, fontWeight: 700 }}>регулярно</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 500, ...fadeUp(frame, cue("silence") - 4) }}>
        <Card accent={C.ok} style={{ padding: "26px 44px 32px 36px" }}>
          <Label>Мовчання суміжної сторони</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 14 }}>
            <Pill tone="ok" size={F.body}>
              перевірити
            </Pill>
            <StruckPill strike={prog(frame, cue("silence") + 40, 14)} size={F.body}>
              заспокоїтися
            </StruckPill>
          </div>
        </Card>
      </div>
    </T2Z7Frame>
  );
};
