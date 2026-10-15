import { Easing, interpolate } from "remotion";

// Рух за брифом: без відскоку, поява fade + зсув 24–40 px за 0,3–0,6 с.
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 між кадрами start і start + dur. */
export const prog = (frame: number, start: number, dur = 15, easing = EASE) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing });

/** Лінійна інтерполяція з обмеженням. */
export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/** Поява з fade і зсувом знизу (або з іншого боку через dx/dy). */
export const fadeUp = (
  frame: number,
  start: number,
  { dur = 14, dx = 0, dy = 32 }: { dur?: number; dx?: number; dy?: number } = {},
) => {
  const t = prog(frame, start, dur);
  return {
    opacity: t,
    translate: `${(1 - t) * dx}px ${(1 - t) * dy}px`,
  };
};

/** Видимість із появою на `inAt` і зникненням на `outAt`. */
export const inOut = (frame: number, inAt: number, outAt: number, dur = 12) =>
  Math.min(prog(frame, inAt, dur), 1 - prog(frame, outAt, dur, EASE_IN_OUT));

/** Плавне зникнення з кадру outAt. */
export const fadeOut = (frame: number, outAt: number, dur = 12) => 1 - prog(frame, outAt, dur, EASE_IN_OUT);

/** Скільки символів рядка вже «надруковано». */
export const typed = (text: string, frame: number, start: number, cps = 28, fps = 30) => {
  const n = Math.floor(((frame - start) / fps) * cps);
  return text.slice(0, Math.max(0, Math.min(text.length, n)));
};
