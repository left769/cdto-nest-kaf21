// Текст для вставки в ElevenLabs (бриф 6): блок на сцену, кількість символів і сума.
// Запуск: npx tsx scripts/voiceover-md.ts <урок> → voiceover/<урок>.md

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { lessonFromArgs } from "../src/lessons/registry";
import { usedReplacements } from "../src/shared/pronunciation";
import { audioPath } from "../src/shared/timing";

const MONTHLY_CREDITS = 10_000;

const { lesson } = lessonFromArgs();
const { id: LESSON, scenes: SCENES } = lesson;
const OUT = path.join(process.cwd(), "voiceover", `${LESSON}.md`);
const FIRST = SCENES[1];

const total = SCENES.reduce((sum, s) => sum + s.voiceText.length, 0);
const file = (id: string) => `public/${audioPath(LESSON, id)}`;
// Цифри, яких немає в таблиці вимови: їх варто послухати.
const digits = (text: string) => [...new Set(text.match(/\d+(?:,\d+)?/g) ?? [])];

const lines = [
  `# Озвучка · ${lesson.label}`,
  "",
  `Файл згенеровано з \`src/lessons/${LESSON}/script.ts\` командою \`npx tsx scripts/voiceover-md.ts ${LESSON}\`.`,
  "Не редагуйте його вручну: текст правиться в `script.ts` (і в брифі), вимова — в `pronunciation.ts`.",
  "",
  "## Як генерувати",
  "",
  "1. elevenlabs.io → Text to Speech. Голос — нативний український із Voice Library, модель — Eleven Multilingual v2.",
  "2. Для всіх сцен — той самий голос і ті самі налаштування, що й у попередніх відео курсу.",
  "3. Вставте блок сцени повністю (лише текст усередині рамки), згенеруйте й завантажте MP3.",
  `4. Збережіть як \`video/studio/public/voiceover/${LESSON}/<id>.mp3\` — назви файлів у таблиці нижче.`,
  `5. **Спершу лише сцена 1 (\`${FIRST.id}\`).** Після неї перевіряємо вимову й синхрон анімації, за потреби уточнюємо таблицю вимови, і лише потім — решта сцен.`,
  "",
  `Ліміт безкоштовного тарифу — ${MONTHLY_CREDITS.toLocaleString("uk-UA")} кредитів на місяць, 1 символ = 1 кредит. Увесь ролик — **${total.toLocaleString("uk-UA")}** символів, тож на місяць вистачає на повний ролик і перегенерацію кількох сцен.`,
  "",
  "| # | Сцена | Файл | Символів |",
  "| --- | --- | --- | ---: |",
  ...SCENES.map((s, i) => `| ${i} | ${s.title} | \`${file(s.id)}\` | ${s.voiceText.length} |`),
  `| | **Разом** | | **${total}** |`,
  "",
  "## Текст по сценах",
  "",
];

SCENES.forEach((s, i) => {
  lines.push(`### ${i} · ${s.title} → \`${s.id}.mp3\` · ${s.voiceText.length} символів`, "");
  lines.push("```text", s.voiceText, "```", "");
  const d = digits(s.voiceText);
  if (d.length) {
    lines.push(`Цифри без заміни (послухати, чи правильно прочитано): ${d.join(", ")}.`, "");
  }
});

lines.push(
  `## Що послухати в сцені 1 (${FIRST.title})`,
  "",
  ...usedReplacements(lesson.pronunciation, FIRST.subtitleText).map((r) => `- ${r} — чи звучить як термін, без зайвих пауз між складами.`),
  ...digits(FIRST.voiceText).map((d) => `- «${d}» — цифра лишилася цифрою (її немає в таблиці вимови).`),
  "- Наголоси й темп: якщо сцена звучить помітно швидше чи повільніше за попередні відео, краще змінити налаштування до генерації інших сцен.",
  "",
);

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, lines.join("\n"));
console.log(`${path.relative(process.cwd(), OUT)}: ${SCENES.length} сцен, ${total} символів`);
