// Таблиця вимови для синтезу (бриф «Управління стейкхолдерами», розділ 6). Субтитри не змінюються.
// ЗІ, ІКС — як у попередніх відео курсу.

import { makeToVoice, PronunciationTable, word } from "../../shared/pronunciation";

export const PRONUNCIATION: PronunciationTable = [
  [word("ІКС"), "і-ка-ес"],
  [word("ЗІ"), "зе-і"],
  [/з 3 днів до 1/gu, "з трьох днів до одного"],
  [/6 стейкхолдерів/gu, "шість стейкхолдерів"],
];

export const toVoice = makeToVoice(PRONUNCIATION);
