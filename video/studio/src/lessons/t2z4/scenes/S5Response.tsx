import React from "react";
import { useCurrentFrame } from "remotion";
import { EASE_IN_OUT, fadeUp, inOut, prog } from "../../../shared/anim";
import { Card, Label } from "../../../shared/Card";
import { Pill } from "../../../shared/Pill";
import { RiskIssueCard } from "../../../shared/RiskIssueCard";
import { StruckCard } from "../../../shared/StruckCard";
import { TermCard } from "../../../shared/TermCard";
import { TodayLine } from "../../../shared/TodayLine";
import { C, F } from "../../../shared/theme";
import { cueOf } from "../../../shared/timing";
import { SceneProps, T2Z4Frame } from "../frame";
import { GLOSSARY } from "../script";

/** Картка заходу реагування: тип, коли спрацьовує, сама дія. */
const Measure: React.FC<{ kind: string; when: string; accent: string; children: React.ReactNode }> = ({ kind, when, accent, children }) => (
  <Card accent={accent} style={{ padding: "20px 40px 24px 32px", width: 760 }}>
    <Label color={C.ink}>
      {kind} <span style={{ color: C.muted, textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>· {when}</span>
    </Label>
    <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, marginTop: 8 }}>{children}</div>
  </Card>
);

export const S5Response: React.FC<SceneProps> = ({ timing }) => {
  const frame = useCurrentFrame();
  const cue = cueOf(timing);
  const move = prog(frame, cue("became") - 6, 30, EASE_IN_OUT);

  return (
    <T2Z4Frame timing={timing} current={4} done={4}>
      <TermCard
        frame={frame}
        at={0}
        outAt={cue("mit") - 22}
        index={4}
        count={GLOSSARY.length}
        title="Mitigation / Contingency"
        titleSize={F.head}
        uk="пом’якшення / запасний план"
      />

      {/* Заздалегідь і на випадок реалізації */}
      <div style={{ position: "absolute", inset: 0, opacity: inOut(frame, cue("mit") - 4, cue("careful") - 8) }}>
        <TodayLine frame={frame} at={cue("mit") - 4} tagTop={836} />
        <div style={{ position: "absolute", top: 556, left: 1010 - 890 * move }}>
          <RiskIssueCard move={move} title="Затримка погодження ТЗ" />
        </div>
        <div style={{ position: "absolute", left: 1000, top: 250, ...fadeUp(frame, cue("mitEx") - 4) }}>
          <Measure kind="Mitigation" when="заздалегідь" accent={C.gold}>
            Надіслати чернетку ТЗ на 3 тижні раніше
          </Measure>
        </div>
        <div style={{ position: "absolute", left: 160, top: 250, ...fadeUp(frame, cue("contEx") - 4) }}>
          <Measure kind="Contingency" when="якщо станеться" accent={C.graphite}>
            Ескалація до командира
          </Measure>
        </div>
      </div>

      {/* Антиприклад */}
      <div style={{ position: "absolute", left: 120, top: 360, display: "flex", alignItems: "center", gap: 40, ...fadeUp(frame, cue("careful") - 4) }}>
        <StruckCard strike={prog(frame, cue("careful") + 18, 14)}>«Бути уважним»</StruckCard>
        <div style={fadeUp(frame, cue("noAction") - 4, { dx: -24, dy: 0 })}>
          <Pill tone="dim" size={F.small}>
            немає дії
          </Pill>
        </div>
      </div>
    </T2Z4Frame>
  );
};
