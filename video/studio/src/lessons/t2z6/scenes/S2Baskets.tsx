import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeUp } from "../../../shared/anim";
import { Card } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { TermCard } from "../../../shared/TermCard";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z6Frame } from "../frame";
import { INITIATIVES } from "../initiatives";
import { GLOSSARY } from "../script";

// Кошики й підписи — бриф, сцена 2 (розділ 2.2 заняття); розкладка ініціатив — еталонне проходження вправи.
// Сітка замість чотирьох колонок: у вузьких колонках назви ініціатив не вміщуються шрифтом ≥ 48.
// Угорі — два кошики з однією ініціативою, нижче на всю ширину — «Ефект» (чотири) і «Підтримка».
type Basket = {
  name: string;
  rule: string[];
  at: string;
  /** Рядки чипів ініціатив (явно, щоб довгі назви не переносилися як прийдеться). */
  items: string[][];
  itemsAt: string;
  accent: string;
  box: { left: number; top: number; width: number; height: number };
  /** Чипи праворуч від назви (широкі кошики) чи під нею. */
  row: boolean;
};

const BASKETS: Basket[] = [
  {
    name: "Обов’язкові",
    rule: ["поза конкурсом,", "першими в ресурсі"],
    at: "mandatory",
    items: [[INITIATIVES.sed]],
    itemsAt: "sed",
    accent: C.bad,
    box: { left: 120, top: 150, width: 820, height: 330 },
    row: false,
  },
  {
    name: "Експерименти",
    rule: ["малий бюджет часу"],
    at: "experiments",
    items: [[INITIATIVES.chatbot]],
    itemsAt: "chatbot",
    accent: C.ok,
    box: { left: 956, top: 150, width: 844, height: 330 },
    row: false,
  },
  {
    name: "Ефект",
    rule: ["спільна шкала"],
    at: "effect",
    items: [
      [INITIATIVES.property, INITIATIVES.dashboard],
      [INITIATIVES.roll, INITIATIVES.repair],
    ],
    itemsAt: "rest",
    accent: C.gold,
    box: { left: 120, top: 496, width: 1680, height: 200 },
    row: true,
  },
  {
    name: "Підтримка",
    rule: ["20–25% ресурсу"],
    at: "support",
    items: [],
    itemsAt: "rest",
    accent: C.graphite,
    box: { left: 120, top: 712, width: 1680, height: 150 },
    row: true,
  },
];

export const S2Baskets: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);

  return (
    <T2Z6Frame timing={timing} current={1} done={1}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("mandatory") - 22}
        index={1}
        count={GLOSSARY.length}
        title="Кошики портфеля"
        uk="ініціативи різні за природою"
      />

      {BASKETS.map((b) => (
        <div key={b.name} style={{ position: "absolute", ...b.box, ...fadeUp(frame, cue(b.at) - 4) }}>
          <Card
            accent={b.accent}
            style={{
              height: "100%",
              boxSizing: "border-box",
              padding: "14px 20px 16px 20px",
              display: "flex",
              flexDirection: b.row ? "row" : "column",
              alignItems: b.row ? "center" : "flex-start",
              gap: 16,
            }}
          >
            <div style={{ width: b.row ? 440 : undefined, flexShrink: 0 }}>
              <div style={{ fontSize: 54, fontWeight: 700 }}>{b.name}</div>
              <div style={{ fontSize: F.small, color: C.muted, lineHeight: 1.2, marginTop: 2 }}>
                {b.rule.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {b.items.map((line, r) => (
                <div key={r} style={{ display: "flex", gap: 12 }}>
                  {line.map((item, k) => (
                    <div key={item} style={fadeUp(frame, cue(b.itemsAt) + (r * 2 + k) * 4, { dy: -40 })}>
                      <Pill tone="ghost" size={F.small} style={{ padding: "0.2em 0.6em" }}>
                        {item}
                      </Pill>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>
      ))}
    </T2Z6Frame>
  );
};
