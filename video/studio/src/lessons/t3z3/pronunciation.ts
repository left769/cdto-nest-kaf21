// Таблиця вимови для синтезу (бриф «Аналіз AS-IS / TO-BE», розділ 6). Субтитри не змінюються.
// ЗІ, ІКС — як у попередніх відео курсу.

import { makeToVoice, PronunciationTable, word } from "../../shared/pronunciation";

export const PRONUNCIATION: PronunciationTable = [
  // Назва кроку зошита: скісна риска в голосі не читається.
  [word("AS-IS / TO-BE"), "ез-із — ту-бі"],
  [word("AS-IS"), "ез-із"],
  [word("TO-BE"), "ту-бі"],
  [word("Gap-аналіз", "giu"), "геп-аналіз"],
  [word("walkthrough", "giu"), "вокс-ру"],
  [word("Lean"), "лін"],
  [word("ІКС"), "і-ка-ес"],
  [word("ЗІ"), "зе-і"],
  [/8%/gu, "вісім відсотків"],
  [/3%/gu, "трьох відсотків"],
];

export const toVoice = makeToVoice(PRONUNCIATION);
