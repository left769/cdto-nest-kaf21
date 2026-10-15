// Таблиця вимови для синтезу (бриф Т2·З4, розділ 6). Субтитри не змінюються.
// Після першої згенерованої сцени прослухати й за потреби уточнити.

import { makeToVoice, PronunciationTable, word } from "../../shared/pronunciation";

export const PRONUNCIATION: PronunciationTable = [
  [word("risk register", "giu"), "ріск-реджистер"],
  [word("risk owner", "giu"), "ріск-оунер"],
  [word("risk", "giu"), "ріск"],
  [word("issue", "giu"), "іш’ю"],
  [word("mitigation", "giu"), "мітигейшн"],
  [word("contingency", "giu"), "контінженсі"],
  [word("RAID-log"), "рейд-лог"],
  [word("Data Analyst"), "дейта-аналіст"],
  [word("DT Lead"), "ді-ті лід"],
  [word("EMV"), "і-ем-ві"],
  [word("PM"), "пі-ем"],
  [word("BA"), "бі-ей"],
  [word("ТЗ"), "те-зе"],
  [word("ЗІ"), "зе-і"],
  [/4,5 дня/gu, "чотири з половиною дні"],
  [/16,5 дня/gu, "шістнадцять з половиною днів"],
  [/50%/gu, "п’ятдесят відсотків"],
  [/30%/gu, "тридцять відсотків"],
  [/20%/gu, "двадцять відсотків"],
];

export const toVoice = makeToVoice(PRONUNCIATION);
