import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

export const RAID_COLORS = {
  R: { bg: C.yellow, fg: C.ink },
  A: { bg: C.graphite, fg: C.onDark },
  I: { bg: C.bad, fg: C.onDark },
  D: { bg: C.black, fg: C.onDark },
} as const;

const LETTERS = [
  { letter: "R", cue: "r", word: "Risk", uk: "ризик", note: "те, що може статися" },
  { letter: "A", cue: "a", word: "Assumption", uk: "припущення", note: "вважаємо правдою, але маємо перевірити" },
  { letter: "I", cue: "i", word: "Issue", uk: "проблема", note: "те, що вже сталося" },
  { letter: "D", cue: "d", word: "Dependency", uk: "залежність", note: "від інших людей чи проєктів" },
] as const;

// Фрагмент RAID-log зі зразка зошита (крок 3).
const LOG = [
  { type: "R", text: "Затримка погодження ТЗ органом ЗІ", owner: "PM" },
  { type: "A", text: "МВО можуть приділяти навчанню 2 год/тиждень", owner: "PM" },
  { type: "I", text: "Немає затвердженого переліку категорій майна", owner: "BA" },
  { type: "D", text: "Рішення командира про доступ до системи", owner: "DT Lead" },
] as const;

export const Letter: React.FC<{ letter: keyof typeof RAID_COLORS; size: number; style?: React.CSSProperties }> = ({
  letter,
  size,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: RAID_COLORS[letter].bg,
      color: RAID_COLORS[letter].fg,
      fontSize: size * 0.62,
      fontWeight: 700,
      ...style,
    }}
  >
    {letter}
  </div>
);

const LINE_X = 960;

export const S4Raid: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const move = prog(frame, cue("happened") - 4, 30, EASE_IN_OUT);
  const owner = prog(frame, cue("owner") - 6, 12);

  return (
    <T2Z3Frame timing={timing} current={3} done={3}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("letters") - 22}
        index={3}
        count={GLOSSARY.length}
        title="RAID-log"
        uk="журнал здоров’я проєкту"
      />

      {/* R · A · I · D */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 150,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          opacity: inOut(frame, cue("letters"), cue("mistake") - 6),
        }}
      >
        {LETTERS.map((l, i) => {
          const open = prog(frame, cue(l.cue) - 4, 14);
          return (
            <div key={l.letter} style={{ display: "flex", alignItems: "center", gap: 40, ...fadeUp(frame, cue("letters") + i * 5) }}>
              <Letter letter={l.letter} size={150} />
              <div style={{ opacity: open, translate: `${(1 - open) * -30}px 0px` }}>
                <div style={{ fontSize: F.big, fontWeight: 700, lineHeight: 1.1 }}>
                  {l.word} <span style={{ fontWeight: 400, color: C.muted }}>— {l.uk}</span>
                </div>
                <div style={{ fontSize: F.small, color: C.muted, marginTop: 6 }}>{l.note}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Межа між ризиком і проблемою — сьогоднішній день */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("mistake"), cue("rule") - 6) }}>
        <div style={{ position: "absolute", left: 120, right: 120, top: 175, display: "flex", justifyContent: "space-between" }}>
          <Label>вже сталося</Label>
          <Label>може статися</Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 560, height: 6, background: C.line }} />
        <div
          style={{
            position: "absolute",
            left: LINE_X - 4,
            top: 250,
            width: 8,
            height: 620,
            background: C.ink,
            ...fadeUp(frame, cue("today") - 4, { dy: 0 }),
          }}
        />
        <div style={{ position: "absolute", left: LINE_X, top: 790, translate: "-50% 0px" }}>
          <div
            style={{
              background: C.ink,
              color: C.onDark,
              fontSize: F.small,
              fontWeight: 700,
              padding: "8px 28px",
              letterSpacing: "0.06em",
              ...fadeUp(frame, cue("today") - 4),
            }}
          >
            СЬОГОДНІ
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 420,
            left: 1010 - 840 * move,
            ...fadeUp(frame, cue("risk") - 4),
          }}
        >
          <Card
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "20px 40px 20px 20px",
              borderColor: interpolateColors(move, [0, 1], [C.yellow, C.bad]),
              borderWidth: 4,
            }}
          >
            <div style={{ position: "relative", width: 124, height: 124 }}>
              <Letter letter="R" size={124} style={{ position: "absolute", opacity: 1 - move }} />
              <Letter letter="I" size={124} style={{ position: "absolute", opacity: move }} />
            </div>
            <div style={{ width: 500 }}>
              <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>Затримка погодження ТЗ</div>
              <div style={{ position: "relative", fontSize: F.small, fontWeight: 500, marginTop: 8, height: 58 }}>
                <span style={{ position: "absolute", opacity: 1 - move, color: C.muted }}>ризик</span>
                <span style={{ position: "absolute", opacity: move, color: C.bad }}>проблема</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Фрагмент журналу: у кожного запису є власник */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 160, ...fadeUp(frame, cue("rule") - 4) }}>
        <Card style={{ padding: 0 }}>
          {[{ type: "Тип", text: "Опис", owner: "Власник" }, ...LOG].map((row, i) => {
            const isHead = i === 0;
            return (
              <div
                key={row.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: isHead ? 96 : 132,
                  borderTop: isHead ? "none" : `2px solid ${C.line}`,
                  fontSize: isHead ? F.small : 52,
                  fontWeight: isHead ? 500 : 400,
                  color: isHead ? C.muted : C.ink,
                }}
              >
                <div style={{ width: 200, paddingLeft: 40 }}>
                  {isHead ? row.type : <Letter letter={row.type as keyof typeof RAID_COLORS} size={84} />}
                </div>
                <div style={{ flex: 1, paddingRight: 32 }}>{row.text}</div>
                <div
                  style={{
                    width: 340,
                    alignSelf: "stretch",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 40,
                    background: `rgba(243, 146, 0, ${(isHead ? 1 : 0.22) * owner})`,
                    color: isHead ? (owner > 0.5 ? C.ink : C.muted) : C.ink,
                    fontWeight: isHead ? 700 : 500,
                  }}
                >
                  {row.owner}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </T2Z3Frame>
  );
};
