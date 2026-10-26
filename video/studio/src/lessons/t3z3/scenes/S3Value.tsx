import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp, prog } from "../../../shared/anim";
import { Pill, PillTone } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T3Z3Frame } from "../frame";
import { GLOSSARY } from "../script";

// Три класи кроків і приклади — розділ 4.5 заняття; «спростити» — пояснення в тесті до заняття.
const CLASSES: { at: string; title: string; example: string; action: string; color: string; tone: PillTone }[] = [
  { at: "c1", title: "Додає цінність", example: "внести дані в систему", action: "лишити", color: C.ok, tone: "ok" },
  { at: "c2", title: "Не додає, але необхідний", example: "погодити акт за нормативом", action: "лишити й спростити", color: C.yellow, tone: "yellow" },
  { at: "c3", title: "Не додає й не потрібен", example: "продублювати в зошит «для надійності»", action: "усунути", color: C.bad, tone: "bad" },
];

/** Приклад кроку; «зайвий» перекреслюється (`strike` 0 → 1). */
const Example: React.FC<{ text: string; strike?: number }> = ({ text, strike = 0 }) => (
  <div style={{ position: "relative", background: C.warmLight, border: `2px solid ${C.line}`, padding: "24px 28px" }}>
    <div style={{ fontSize: 52, fontWeight: 500, lineHeight: 1.2, color: strike > 0 ? C.dim : C.ink }}>{text}</div>
    {strike > 0 ? (
      <div style={{ position: "absolute", left: 20, top: "50%", height: 7, width: `calc((100% - 40px) * ${strike})`, background: C.muted }} />
    ) : null}
  </div>
);

export const S3Value: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T3Z3Frame timing={timing} current={2} done={2}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("three") - 22}
        index={2}
        count={GLOSSARY.length}
        title="Додана цінність"
        titleSize={F.head}
        uk="внесок кроку в корисний результат"
      />

      <div style={{ position: "absolute", left: 120, right: 120, top: 160, display: "flex", gap: 24 }}>
        {CLASSES.map((c) => (
          <div key={c.at} style={{ flex: 1, ...fadeUp(frame, cue(c.at) - 4) }}>
            <div
              style={{
                background: C.card,
                border: `2px solid ${C.line}`,
                borderTop: `16px solid ${c.color}`,
                padding: "22px 28px 28px",
                height: 570,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, minHeight: 130 }}>{c.title}</div>
              <div style={{ marginTop: 18, flex: 1 }}>
                <Example text={c.example} strike={c.at === "c3" ? prog(frame, cue("remove") - 2, 14) : 0} />
              </div>
              <div style={fadeUp(frame, cue(c.at) + 30)}>
                <Pill tone={c.tone} size={F.small}>
                  {c.action}
                </Pill>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 120, right: 120, top: 760, fontSize: 56, fontWeight: 700, lineHeight: 1.2, ...fadeUp(frame, cue("goal") - 4) }}>
        Мета TO-BE: <span style={{ color: C.ok }}>більше кроків з цінністю</span>, <span style={{ color: C.bad }}>жодного безцінного</span>
      </div>
    </T3Z3Frame>
  );
};
