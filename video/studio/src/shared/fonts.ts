import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT } from "./theme";

// Шрифт e-Ukraine © Мінцифри, CC BY 4.0 (thedigital.gov.ua/fonts).
const WEIGHTS = [
  ["300", "e-Ukraine-Light.woff2"],
  ["400", "e-Ukraine-Regular.woff2"],
  ["500", "e-Ukraine-Medium.woff2"],
  ["700", "e-Ukraine-Bold.woff2"],
] as const;

export const fontsLoaded = Promise.all(
  WEIGHTS.map(([weight, file]) =>
    loadFont({
      family: FONT,
      url: staticFile(`fonts/${file}`),
      weight,
      display: "block",
    }),
  ),
);
