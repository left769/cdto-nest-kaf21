import React from "react";
import { AbsoluteFill } from "remotion";
import { GlossaryState, GlossaryStrip } from "./GlossaryStrip";
import { C, FONT, SAFE_X } from "./theme";

/**
 * Спільна рамка сцени: тло, мітка заняття зліва вгорі й смуга глосарію внизу.
 * Смуга є в кожній сцені, тож під час fade-переходу підсвітка плавно переходить
 * на наступну комірку.
 */
export const SceneFrame: React.FC<{
  dark?: boolean;
  lessonLabel: string;
  glossary: GlossaryState;
  glossaryStyle?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ dark, lessonLabel, glossary, glossaryStyle, children }) => (
  <AbsoluteFill
    style={{
      background: dark ? C.black : C.warm,
      color: dark ? C.onDark : C.ink,
      fontFamily: FONT,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: SAFE_X,
        top: 44,
        fontSize: 48,
        fontWeight: 400,
        color: dark ? C.onDarkMuted : C.muted,
      }}
    >
      {lessonLabel}
    </div>
    {children}
    <GlossaryStrip {...glossary} style={glossaryStyle} />
  </AbsoluteFill>
);
