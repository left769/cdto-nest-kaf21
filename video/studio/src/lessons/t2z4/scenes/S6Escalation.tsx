import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z4Frame } from "../frame";
import { GLOSSARY } from "../script";
import { TwoFutures } from "../TwoFutures";

// Критерії ескалації (заняття, 5.4) і повідомлення (зошит, крок 4).
const CRITERIA = [
  { when: "Затримка понад 2 тижні", then: "ескалюємо", at: "c1" },
  { when: "Загроза віхи пілоту", then: "на рівень вище", at: "c2" },
];
const CHAIN = [
  ["fRisk", "Ризик"],
  ["fCons", "Наслідок"],
  ["fDo", "Що робимо"],
  ["fNeed", "Що потрібно"],
] as const;
const MESSAGE = [
  { label: "Ризик", text: "Погодження ТЗ може затриматися на\u00a03\u00a0тижні", at: "mRisk" },
  { label: "Наслідок", text: "Загроза віхи пілоту", at: "mCons" },
  { label: "Робимо", text: "Ранній старт узгодження", at: "mDo" },
  { label: "Потрібно", text: "Сприяння в пришвидшенні погодження органом ЗІ", at: "mNeed" },
];

const Arrow: React.FC = () => (
  <svg width={56} height={36} style={{ flexShrink: 0 }}>
    <path d="M0 18 H44 M30 4 L48 18 L30 32" fill="none" stroke={C.gold} strokeWidth={6} />
  </svg>
);

export const S6Escalation: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z4Frame timing={timing} current={5} done={5}>
      <TermCard frame={frame} at={0} outAt={cue("criteria") - 22} index={5} count={GLOSSARY.length} title="Escalation" uk="ескалація" />

      {/* Критерії — заздалегідь */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("criteria") - 4, cue("formula") - 8) }}>
        <div style={{ position: "absolute", left: 120, top: 160 }}>
          <Label>Критерії — заздалегідь</Label>
        </div>
        {CRITERIA.map((c, i) => (
          <div
            key={c.at}
            style={{ position: "absolute", left: 120, top: 240 + i * 150, display: "flex", alignItems: "center", gap: 32, ...fadeUp(frame, cue(c.at) - 4) }}
          >
            <Card style={{ padding: "22px 40px" }}>
              <div style={{ fontSize: F.body, fontWeight: 700 }}>{c.when}</div>
            </Card>
            <Arrow />
            <Pill tone="gold" size={F.body}>
              {c.then}
            </Pill>
          </div>
        ))}
        <div style={{ position: "absolute", left: 120, top: 600, ...fadeUp(frame, cue("managed") - 4) }}>
          <Pill tone="dark" size={F.body}>
            керована управлінська дія, а не скарга
          </Pill>
          <div style={{ fontSize: F.small, color: C.muted, marginTop: 20 }}>своєчасна ескалація часто рятує проєкт</div>
        </div>
      </div>

      {/* Формула доповіді й повідомлення */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("formula") - 4, cue("early") - 10) }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 150, display: "flex", alignItems: "center", gap: 16 }}>
          {CHAIN.map(([at, label], i) => (
            <React.Fragment key={at}>
              {i > 0 ? (
                <div style={{ opacity: prog(frame, cue(at) - 4, 8) }}>
                  <Arrow />
                </div>
              ) : null}
              <div style={fadeUp(frame, cue(at) - 4, { dx: -16, dy: 0 })}>
                <Pill tone={at === "fNeed" ? "gold" : "outline"} size={F.small}>
                  {label}
                </Pill>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 280, ...fadeUp(frame, cue("mRisk") - 8) }}>
          <Card style={{ padding: 0 }}>
            {MESSAGE.map((m, i) => {
              const need = m.label === "Потрібно";
              return (
                <div
                  key={m.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: 92,
                    borderTop: i === 0 ? "none" : `2px solid ${C.line}`,
                    borderLeft: `14px solid ${need ? C.gold : "transparent"}`,
                    background: need ? `rgba(243, 146, 0, ${0.16 * prog(frame, cue(m.at) - 4, 10)})` : "transparent",
                    opacity: prog(frame, cue(m.at) - 4, 10),
                  }}
                >
                  <div style={{ width: 300, flexShrink: 0, paddingLeft: 26, fontSize: F.small, color: need ? C.ink : C.muted, fontWeight: 500 }}>{m.label}</div>
                  <div style={{ flex: 1, fontSize: 52, fontWeight: need ? 700 : 500, lineHeight: 1.15, padding: "14px 40px 14px 0" }}>{m.text}</div>
                </div>
              );
            })}
          </Card>
        </div>
        <div style={{ position: "absolute", left: 120, top: 800, ...fadeUp(frame, cue("notConcern") - 4) }}>
          <Pill tone="gold" size={F.small}>
            не «занепокоєння», а запит конкретного рішення
          </Pill>
        </div>
      </div>

      {/* Повернення до вступу: заздалегідь, а не в день віхи */}
      <div style={{ position: "absolute", inset: 0, opacity: prog(frame, cue("early") - 4, 12) }}>
        <TwoFutures
          frame={frame}
          dark={false}
          top={150}
          topAt={cue("early") - 4}
          fireAt={cue("early") - 4}
          bottomAt={cue("early") - 4}
          planAt={cue("early") - 4}
          focusAt={cue("early") + 6}
        />
        <div style={{ position: "absolute", left: 120, top: 800, ...fadeUp(frame, cue("early") + 12) }}>
          <Pill tone="gold" size={F.small}>
            заздалегідь, а не в день віхи
          </Pill>
        </div>
      </div>
    </T2Z4Frame>
  );
};
