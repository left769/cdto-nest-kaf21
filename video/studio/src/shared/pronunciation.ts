// Заміни для синтезу мовлення (бриф 6): субтитри лишаються як є, у текст для TTS
// терміни й числа потрапляють у вимовній формі. Таблиця — окремо в кожному уроці.

export type PronunciationTable = [RegExp, string][];

// \b не працює з кирилицею, тож межі слова — через Unicode-класи.
export const word = (s: string, flags = "gu") => new RegExp(`(?<![\\p{L}\\p{N}])${s}(?![\\p{L}\\p{N}])`, flags);

// На початку речення заміна пишеться з великої літери («Дісіжн-лог фіксує…»).
const sentenceStart = /(^|[.!?…]\s+)$/u;

export const makeToVoice = (table: PronunciationTable) => (text: string) =>
  table.reduce(
    (out, [from, to]) =>
      out.replace(from, (_match, offset: number, whole: string) =>
        sentenceStart.test(whole.slice(0, offset)) ? to[0].toUpperCase() + to.slice(1) : to,
      ),
    text,
  );

/** Які заміни з таблиці трапляються в тексті: «KPI → кей-пі-ай». */
export const usedReplacements = (table: PronunciationTable, text: string) => {
  const seen = new Map<string, string>();
  for (const [from, to] of table) {
    for (const m of text.matchAll(new RegExp(from.source, from.flags))) {
      const key = m[0].toLowerCase();
      if (!seen.has(key)) seen.set(key, `${m[0]} → ${to}`);
    }
  }
  return [...seen.values()];
};
