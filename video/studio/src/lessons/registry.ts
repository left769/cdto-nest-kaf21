// Реєстр уроків без React-компонентів — для скриптів у Node.

import type { LessonMeta } from "../shared/lesson";
import { T2Z3 } from "./t2z3/meta";
import { T2Z4 } from "./t2z4/meta";

export const LESSONS: Record<string, LessonMeta> = {
  [T2Z3.id]: T2Z3,
  [T2Z4.id]: T2Z4,
};

/** Урок за першим аргументом командного рядка (npx tsx scripts/… t2z4 …). */
export const lessonFromArgs = (argv = process.argv.slice(2)) => {
  const lesson = LESSONS[argv[0]];
  if (!lesson) {
    throw new Error(`Вкажіть урок першим аргументом: ${Object.keys(LESSONS).join(", ")}`);
  }
  return { lesson, rest: argv.slice(1) };
};
