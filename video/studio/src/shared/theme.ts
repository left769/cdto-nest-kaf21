// Токени візуальної мови сайту (docs/stylesheets/mod-theme.css), бриф розділ 5.

export const C = {
  black: "#141414",
  graphite: "#2c2c2c",
  warm: "#eeece7",
  warmLight: "#f5f5f2",
  card: "#ffffff",
  line: "#dcd9d1",
  ink: "#11181c",
  muted: "#555555",
  gold: "#f39200",
  yellow: "#ffbd1b",
  // Приглушені зелений і червоний у гамі сайту: світлофор і чипи «< 1».
  ok: "#3d7f52",
  bad: "#b8442c",
  onDark: "#ffffff",
  onDarkMuted: "#b9b9b9",
  dim: "#8c8c8c",
} as const;

export const FONT = "e-Ukraine";

// Розміри для 1920×1080 (бриф 5): заголовок ≈ 150, важливий текст ≈ 78, дрібне ≥ 48.
export const F = {
  title: 150,
  head: 110,
  big: 78,
  body: 64,
  small: 48,
} as const;

// Безпечне поле кадру й смуга глосарію внизу.
export const SAFE_X = 120;
export const STRIP_H = 140;
export const STRIP_TOP = 1080 - STRIP_H;
