import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T4Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Поля плану — розділ 2.2 лекції; рядки прикладу — Додаток 3; помилки — «Типові помилки» розділу 2.
const FIELDS = [
  { at: "fields", text: "стейкхолдер" },
  { at: "f1", text: "квадрант" },
  { at: "f2", text: "потреби й очікування" },
  { at: "f3", text: "побоювання" },
  { at: "f4", text: "комунікація: що, як, як часто" },
  { at: "f5", text: "відповідальний" },
];
const ROWS = [
  { at: "r1", who: "Командування", quadrant: "керувати тісно", needs: "достовірні дані", fear: "зрив строків", strategy: "регулярний статус, чесність про ризики" },
  { at: "r2", who: "Начальник складу", quadrant: "керувати тісно", needs: "простота", fear: "виявлення розбіжностей", strategy: "залучити, показати вигоду, зняти страх" },
  { at: "r3", who: "Орган ЗІ", quadrant: "тримати задоволеним", needs: "дотримання вимог ЗІ", fear: null, strategy: "раннє залучення, погодження" },
];

/** Рядок картки: коротка мітка тим самим кеглем, щоб текст Додатку 3 вміщався в один рядок. */
const Line: React.FC<{ label: string; color?: string; children: React.ReactNode }> = ({ label, color = C.muted, children }) => (
  <div style={{ fontSize: F.small, lineHeight: 1.2, whiteSpace: "nowrap" }}>
    <span style={{ color, fontWeight: 700 }}>{label}</span> {children}
  </div>
);

export const S3Plan: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  // На помилках приклад плану відходить на другий план.
  const back = 1 - 0.92 * prog(frame, cue("errors") - 6, 14);

  return (
    <T4Z3Frame timing={timing} current={2} done={2}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("managed") - 22}
        index={2}
        count={GLOSSARY.length}
        title="План управління"
        titleSize={F.head}
        uk="адресна робота з кожною стороною"
      />

      {/* Керована, а не хаотична робота; поля плану */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("managed") - 4, cue("r1") - 10) }}>
        <div style={{ position: "absolute", left: 120, top: 170, display: "flex", alignItems: "center", gap: 24, ...fadeUp(frame, cue("managed") - 2) }}>
          <Pill tone="dim" size={F.body}>
            хаотично
          </Pill>
          <div style={{ fontSize: F.body, color: C.gold, fontWeight: 700 }}>→</div>
          <Pill tone="gold" size={F.body}>
            керовано
          </Pill>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 320, ...fadeUp(frame, cue("fields") - 4) }}>
          <Label>Для кожної сторони план фіксує</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 24, width: 1500 }}>
            {FIELDS.map((f) => (
              <div key={f.at} style={fadeUp(frame, cue(f.at) - 4)}>
                <Pill tone={f.at === "f3" ? "bad" : "ghost"} size={F.body}>
                  {f.text}
                </Pill>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Приклад плану */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 150, display: "flex", flexDirection: "column", gap: 16, opacity: back }}>
        {ROWS.map((r) => (
          <div key={r.at} style={fadeUp(frame, cue(r.at) - 4, { dx: -24, dy: 0 })}>
            <Card
              accent={r.quadrant === "керувати тісно" ? C.gold : C.graphite}
              style={{ height: 230, boxSizing: "border-box", padding: "18px 24px 0 28px", display: "flex", gap: 24 }}
            >
              <div style={{ width: 450, flexShrink: 0 }}>
                <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{r.who}</div>
                <div style={{ fontSize: F.small, color: r.quadrant === "керувати тісно" ? C.gold : C.muted, fontWeight: 500, marginTop: 6 }}>
                  {r.quadrant}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 2 }}>
                <Line label="потреби:">{r.needs}</Line>
                {r.fear ? (
                  <Line label="побоювання:" color={C.bad}>
                    {r.fear}
                  </Line>
                ) : null}
                <Line label="→" color={C.gold}>
                  {r.strategy}
                </Line>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Типові помилки */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ display: "flex", gap: 28 }}>
          <div style={fadeUp(frame, cue("errors") - 2)}>
            <Pill tone="bad" size={F.big}>
              «для галочки»
            </Pill>
          </div>
          <div style={fadeUp(frame, cue("errors") + 14)}>
            <Pill tone="bad" size={F.big}>
              без відповідального
            </Pill>
          </div>
        </div>
        <div style={{ fontSize: F.big, fontWeight: 700, ...fadeUp(frame, cue("errors") + 30) }}>= план не працює</div>
      </div>
    </T4Z3Frame>
  );
};
