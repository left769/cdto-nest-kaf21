// Таблиця вимови для синтезу (бриф «Залежності та інтеграція», розділ 6). Субтитри не змінюються.
// RAID-log, contingency, ЗІ, ТЗ — як у попередніх відео курсу.

import { makeToVoice, PronunciationTable, word } from "../../shared/pronunciation";

export const PRONUNCIATION: PronunciationTable = [
  [word("Dependency map", "giu"), "депенденсі меп"],
  [word("interface point", "giu"), "інтерфейс поінт"],
  [word("RAID-log"), "рейд-лог"],
  [word("contingency", "giu"), "контінженсі"],
  [word("API"), "ей-пі-ай"],
  [word("RACI"), "рейсі"],
  [word("ДСК"), "де-ес-ка"],
  [word("ФЕО"), "фе-е-о"],
  [word("ІКС"), "і-ка-ес"],
  [word("ЗІ"), "зе-і"],
  [word("ТЗ"), "те-зе"],
];

export const toVoice = makeToVoice(PRONUNCIATION);
