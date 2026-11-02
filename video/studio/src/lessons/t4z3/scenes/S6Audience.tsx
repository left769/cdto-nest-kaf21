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

// Адаптація й формулювання — розділ 5.1 і таблиця розділу 5.2 лекції; антиприклад і принципи — 5.2.
const AUDIENCES = [
  {
    at: "a1",
    who: "Командування",
    lang: "мовою ефекту",
    quote: "«Скоротимо час інвентаризації з 3 днів до 1; дані для рішень стануть достовірними»",
  },
  {
    at: "a2",
    who: "Користувач",
    lang: "мовою зручності",
    quote: "«Не треба буде вести подвійний облік і вручну звіряти — система зробить це за вас»",
  },
  {
    at: "a3",
    who: "Технічний фахівець",
    lang: "мовою реалізації",
    quote: "«Єдиний реєстр із рольовим доступом і автоматичним звірянням, інтеграція з кадровою системою»",
  },
];
const ANTI = ["«Впроваджуємо ІКС", "із рольовою моделлю доступу»"];
const PRINCIPLES = [
  { at: "p1", text: "почати з «навіщо»" },
  { at: "p2", text: "без жаргону, через приклади" },
  { at: "p3", text: "вигода для цієї аудиторії" },
  { at: "p4", text: "чесно про обмеження" },
];

export const S6Audience: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T4Z3Frame timing={timing} current={5} done={5}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("same") - 22}
        index={5}
        count={GLOSSARY.length}
        title="Адаптація до аудиторії"
        titleSize={F.head}
        uk="пояснення мовою вигоди конкретної сторони"
      />

      {/* Антиприклад: технічно для всіх */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 260, opacity: inOut(frame, cue("same") - 4, cue("a1") - 10) }}>
        <Label>Замість</Label>
        {/* Два рядки — кожен зі своєю лінією перекреслення. */}
        <Card muted style={{ marginTop: 16, padding: "24px 56px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {ANTI.map((line, i) => (
            <div key={line} style={{ position: "relative", alignSelf: "flex-start", fontSize: F.body, fontWeight: 500, color: C.dim, lineHeight: 1.25 }}>
              {line}
              <div
                style={{
                  position: "absolute",
                  left: -8,
                  top: "52%",
                  height: 8,
                  width: `calc((100% + 16px) * ${prog(frame, cue("same") + 40 + i * 12, 14)})`,
                  background: C.muted,
                }}
              />
            </div>
          ))}
        </Card>
        <div style={{ fontSize: F.big, fontWeight: 700, marginTop: 56, ...fadeUp(frame, cue("same") + 50) }}>
          одне рішення — <span style={{ color: C.gold }}>три пояснення</span>
        </div>
      </div>

      {/* Три аудиторії */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 150,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: inOut(frame, cue("a1") - 4, cue("error") - 10),
        }}
      >
        {AUDIENCES.map((a) => (
          <div key={a.at} style={fadeUp(frame, cue(a.at) - 4, { dx: -24, dy: 0 })}>
            <Card accent={C.gold} style={{ padding: "18px 36px 22px 30px" }}>
              <div style={{ fontSize: F.small, fontWeight: 700 }}>
                {a.who} <span style={{ color: C.gold }}>·</span> <span style={{ fontWeight: 500, color: C.muted }}>{a.lang}</span>
              </div>
              <div style={{ fontSize: F.small, lineHeight: 1.2, marginTop: 8 }}>{a.quote}</div>
            </Card>
          </div>
        ))}
      </div>

      {/* Помилка і принципи простого пояснення */}
      <div style={{ position: "absolute", left: 120, top: 160, ...fadeUp(frame, cue("error") - 4) }}>
        <Pill tone="bad" size={F.small}>
          помилка: з усіма однаково — технічно або абстрактно
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 300, ...fadeUp(frame, cue("p1") - 4) }}>
        <Label>Як пояснювати просто</Label>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, marginTop: 20 }}>
          {PRINCIPLES.map((p) => (
            <div key={p.at} style={fadeUp(frame, cue(p.at) - 2, { dx: -24, dy: 0 })}>
              <Pill tone={p.at === "p4" ? "gold" : "ghost"} size={F.body}>
                {p.text}
              </Pill>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 1100, top: 744, fontSize: F.small, color: C.muted, ...fadeUp(frame, cue("silence") - 4) }}>
        замовчування підриває довіру
      </div>
    </T4Z3Frame>
  );
};
