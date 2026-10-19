import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { FinalCard } from "../../../shared/Practice";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { LESSON_LABEL, SceneProps, T2Z5Frame } from "../frame";
import { GLOSSARY } from "../script";

// Кейси 2–4 (Додаток 4) — лише ситуації; розв’язки слухачі шукають самі.
const CASES = [
  { n: 2, title: "Залежність від підрядника", concept: "Підрядники", at: "c2" },
  { n: 3, title: "Опір змінам", concept: "Kotter", at: "c3" },
  { n: 4, title: "Обмежене фінансування", concept: "ROI · обмеження", at: "c4" },
];
const APPENDICES = [
  { n: "4", text: "картки кейсів", at: "a4" },
  { n: "5", text: "критерії оцінювання", at: "a5" },
  { n: "1–3", text: "шаблони: capacity plan · ROI · Коттер", at: "a13" },
];

export const S8Seminar: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const speechEnd = timing.speechStart + timing.speechFrames;

  return (
    <T2Z5Frame timing={timing} current={null} done={GLOSSARY.length}>
      <div style={{ position: "absolute", left: 120, top: 130, ...fadeUp(frame, 0) }}>
        <Label>На семінарі · малі групи</Label>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 190, display: "flex", gap: 28 }}>
        {CASES.map((c) => (
          <div key={c.n} style={{ flex: 1, ...fadeUp(frame, cue(c.at) - 4) }}>
            <Card accent={C.graphite} style={{ padding: "20px 28px 22px", height: 285, boxSizing: "border-box" }}>
              <Label>Кейс {c.n}</Label>
              <div style={{ fontSize: F.small, fontWeight: 700, lineHeight: 1.15, marginTop: 8, minHeight: 116 }}>{c.title}</div>
              <div style={{ fontSize: F.small, color: C.muted, marginTop: 10 }}>{c.concept}</div>
            </Card>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 120, top: 500, display: "flex", gap: 24, ...fadeUp(frame, cue("timing") - 4) }}>
        <Pill tone="dark" size={F.small}>
          обговорення 5–7 хв
        </Pill>
        <Pill tone="dark" size={F.small}>
          представлення 2–3 хв
        </Pill>
      </div>

      {/* Що в додатках */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 608, ...fadeUp(frame, cue("apps") - 4) }}>
        <Label>Додатки до заняття</Label>
        {APPENDICES.map((a) => (
          <div key={a.n} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 4, ...fadeUp(frame, cue(a.at) - 4, { dx: -24, dy: 0 }) }}>
            <Pill tone="gold" size={F.small}>
              Додаток {a.n}
            </Pill>
            <div style={{ fontSize: F.small }}>{a.text}</div>
          </div>
        ))}
      </div>

      <FinalCard frame={frame} at={speechEnd - 10} label="Матеріали" from="Текст заняття" to="Додатки 1–5" lessonLabel={LESSON_LABEL} />
    </T2Z5Frame>
  );
};
