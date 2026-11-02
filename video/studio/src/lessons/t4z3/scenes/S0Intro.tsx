import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Bubble } from "../../../shared/Bubble";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T4Z3Frame } from "../frame";

// Опір начальника складу — розділ 4.2 лекції; «люди, а не технології» — крок зошита «Стейкхолдери й переговори».
const VERBS = ["виявити", "класифікувати", "спланувати комунікацію", "будувати довіру"];

export const S0Intro: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const strip = prog(frame, cue("concepts"), 18);
  // «Проти цифри» перекреслюється й поступається справжній причині.
  const strike = prog(frame, cue("really") - 2, 14);
  const real = prog(frame, cue("really") + 10, 14);

  return (
    <T4Z3Frame timing={timing} dark current={null} done={0} glossaryStyle={{ opacity: strip, translate: `0px ${(1 - strip) * 140}px` }}>
      {/* Система → начальник складу: опір */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("system") - 6, cue("people") - 8) }}>
        <div style={{ position: "absolute", left: 120, top: 600, width: 820, ...fadeUp(frame, cue("system") - 2, { dx: -24, dy: 0 }) }}>
          <Card accent={C.gold} style={{ padding: "28px 40px 34px 32px" }}>
            <Label>Підрозділ впроваджує</Label>
            <div style={{ fontSize: F.body, fontWeight: 700, marginTop: 8, lineHeight: 1.15 }}>систему обліку майна</div>
          </Card>
        </div>
        <svg width={110} height={60} style={{ position: "absolute", left: 948, top: 690, opacity: prog(frame, cue("chief") - 4, 10) }}>
          <path d="M0 30 H66" stroke={C.gold} strokeWidth={6} />
          <path d="M86 0 V60" stroke={C.bad} strokeWidth={14} />
        </svg>
        <div style={{ position: "absolute", left: 1060, top: 600, width: 740, ...fadeUp(frame, cue("chief") - 2, { dx: 24, dy: 0 }) }}>
          <Card style={{ padding: "28px 40px 34px" }}>
            <div style={{ fontSize: F.body, fontWeight: 700, whiteSpace: "nowrap" }}>Начальник складу</div>
            <div style={{ marginTop: 14 }}>
              <Pill tone="bad" size={F.small}>
                опирається
              </Pill>
            </div>
          </Card>
        </div>

        {/* Здається / насправді — репліки над начальником складу */}
        <div style={{ position: "absolute", left: 1060, bottom: 530, display: "grid" }}>
          <div style={{ gridArea: "1 / 1", alignSelf: "end", opacity: (1 - real) * prog(frame, cue("seems") - 4, 12) }}>
            <Bubble side="left" tone="light">
              <div style={{ position: "relative" }}>
                <Label>Здається</Label>
                <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 6, color: strike > 0 ? C.dim : C.ink }}>«проти цифри»</div>
                <div style={{ position: "absolute", left: 0, top: 108, height: 7, width: `${100 * strike}%`, background: C.muted }} />
              </div>
            </Bubble>
          </div>
          <div style={{ gridArea: "1 / 1", alignSelf: "end", opacity: real }}>
            <Bubble side="left" tone="gold">
              <Label color={C.ink}>Насправді побоюється</Label>
              <div style={{ fontSize: F.body, fontWeight: 700, marginTop: 6, width: 640, lineHeight: 1.15 }}>система виявить давні розбіжності</div>
            </Bubble>
          </div>
        </div>
      </div>

      {/* Проєкти зупиняють люди → працювати системно */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("people") - 4, cue("title") - 12) }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 220, fontSize: F.head, fontWeight: 700, lineHeight: 1.15 }}>
          Проєкти частіше зупиняють <span style={{ color: C.gold }}>люди</span>, ніж технології
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 640, display: "flex", flexWrap: "wrap", gap: 18 }}>
          {VERBS.map((v, i) => (
            <div key={v} style={fadeUp(frame, cue("verbs") + i * 10)}>
              <Pill tone="gold" size={F.body}>
                {v}
              </Pill>
            </div>
          ))}
        </div>
      </div>

      {/* Назва ролика */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 140, ...fadeUp(frame, cue("title")) }}>
        <div style={{ fontSize: F.head, fontWeight: 700, lineHeight: 1.1 }}>Управління стейкхолдерами:</div>
        <div style={{ fontSize: F.big, fontWeight: 400, marginTop: 16, color: C.onDark }}>
          <span style={{ color: C.gold, fontWeight: 700 }}>6 понять</span> із лекції
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 560, ...fadeUp(frame, cue("title") + 24) }}>
        <Card accent={C.gold} style={{ padding: "36px 64px 44px 56px", width: 1400 }}>
          <Label>Приклад</Label>
          <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 12 }}>Система обліку майна</div>
          <div style={{ fontSize: F.small, color: C.muted, marginTop: 16 }}>командування · начальник складу · орган ЗІ</div>
        </Card>
      </div>
    </T4Z3Frame>
  );
};
