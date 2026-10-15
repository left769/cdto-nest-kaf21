import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { getStaticFiles, staticFile } from "remotion";

export const FPS = 30;
// Бриф 6: сцена = голос + 0,6 с. Ділимо паузу: 0,2 с до голосу й 0,4 с після.
export const LEAD_IN = 6;
export const TAIL = 12;
// Перехід між сценами (fade ≈ 15 кадрів) накладає сусідні сцени,
// тому до кожної сцени, крім останньої, додаємо його тривалість.
export const TRANSITION = 15;
// Остання сцена: час прочитати фінальну картку.
export const FINAL_HOLD = 60;

const WORDS_PER_SECOND = 2.3;
const FALLBACK_EXTRA_SECONDS = 1.5;
const PAUSE_SECONDS = (LEAD_IN + TAIL) / FPS;

export type SceneDef = {
  id: string;
  title: string;
  /** Текст субтитрів: цифри цифрами, терміни латиницею. */
  subtitleText: string;
  /** Текст для синтезу мовлення (після таблиці вимови). */
  voiceText: string;
  /** Оцінка тривалості сцени без голосу: слова / 2,3 + 1,5 с. */
  fallbackSeconds: number;
  /** Якорі анімації: частка сцени (0–1), коли звучить фраза. */
  cues: Record<string, number>;
};

export type SceneTiming = {
  id: string;
  durationInFrames: number;
  speechStart: number;
  speechFrames: number;
  audioSrc: string | null;
  /** Кадр, з якого вміст сцени зникає перед переходом (null — остання сцена). */
  exitAt: number | null;
  cues: Record<string, number>;
};

const countWords = (text: string) => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

/**
 * Збирає сцену: перетворює текст для синтезу й рахує, у якій частці мовлення
 * звучить кожна фраза-якір (пропорційно кількості символів, як і субтитри).
 */
export const defineScene = (
  toVoice: (text: string) => string,
  scene: { id: string; title: string; subtitleText: string; cues: Record<string, string> },
): SceneDef => {
  const voiceText = toVoice(scene.subtitleText);
  const cues: Record<string, number> = {};
  for (const [name, phrase] of Object.entries(scene.cues)) {
    const index = scene.subtitleText.indexOf(phrase);
    if (index === -1 || scene.subtitleText.indexOf(phrase, index + 1) !== -1) {
      throw new Error(`Сцена ${scene.id}: якір «${phrase}» не знайдено або він не єдиний`);
    }
    cues[name] = toVoice(scene.subtitleText.slice(0, index)).length / voiceText.length;
  }
  return {
    ...scene,
    voiceText,
    fallbackSeconds: countWords(voiceText) / WORDS_PER_SECOND + FALLBACK_EXTRA_SECONDS,
    cues,
  };
};

export const audioPath = (lesson: string, sceneId: string) => `voiceover/${lesson}/${sceneId}.mp3`;

const audioSeconds = async (lesson: string, sceneId: string) => {
  const path = audioPath(lesson, sceneId);
  if (!getStaticFiles().some((f) => f.name === path)) {
    return null;
  }
  const input = new Input({ formats: ALL_FORMATS, source: new UrlSource(staticFile(path)) });
  return input.computeDuration();
};

export const computeSceneTiming = (
  lesson: string,
  scene: SceneDef,
  seconds: number | null,
  isLast: boolean,
): SceneTiming => {
  const speechFrames = Math.ceil(
    (seconds === null ? scene.fallbackSeconds - PAUSE_SECONDS : seconds) * FPS,
  );
  const cues: Record<string, number> = {};
  for (const [name, share] of Object.entries(scene.cues)) {
    cues[name] = LEAD_IN + Math.round(share * speechFrames);
  }
  return {
    id: scene.id,
    durationInFrames: LEAD_IN + speechFrames + TAIL + (isLast ? FINAL_HOLD : TRANSITION),
    speechStart: LEAD_IN,
    speechFrames,
    audioSrc: seconds === null ? null : staticFile(audioPath(lesson, scene.id)),
    exitAt: isLast ? null : LEAD_IN + speechFrames,
    cues,
  };
};

export const loadTimings = async (lesson: string, scenes: SceneDef[]) => {
  const seconds = await Promise.all(scenes.map((s) => audioSeconds(lesson, s.id)));
  return scenes.map((s, i) => computeSceneTiming(lesson, s, seconds[i], i === scenes.length - 1));
};

/** Тривалість ролика з урахуванням накладання переходів. */
export const totalFrames = (timings: SceneTiming[]) =>
  timings.reduce((sum, t) => sum + t.durationInFrames, 0) - TRANSITION * (timings.length - 1);

/** Кадр початку кожної сцени в ролику. */
export const sceneStarts = (timings: SceneTiming[]) => {
  let at = 0;
  return timings.map((t) => {
    const start = at;
    at += t.durationInFrames - TRANSITION;
    return start;
  });
};

/** Кадр якоря; помилка, якщо назви немає (щоб опечатка не зламала синхрон мовчки). */
export const cueOf = (timing: SceneTiming) => (name: string) => {
  const frame = timing.cues[name];
  if (frame === undefined) {
    throw new Error(`Сцена ${timing.id}: немає якоря «${name}»`);
  }
  return frame;
};
