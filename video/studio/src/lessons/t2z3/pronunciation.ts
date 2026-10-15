// Таблиця вимови для синтезу (бриф 6). Субтитри не змінюються.
// Після першої згенерованої сцени прослухати й за потреби уточнити.

import { makeToVoice, PronunciationTable, word } from "../../shared/pronunciation";

export const PRONUNCIATION: PronunciationTable = [
  [word("RAID-log"), "рейд-лог"],
  [word("Decision log"), "дісіжн-лог"],
  [word("Action log"), "екшн-лог"],
  [word("DT Lead"), "ді-ті лід"],
  [word("Earned Value"), "ерн-вел’ю"],
  [word("burn-down"), "берн-даун"],
  [word("KPI"), "кей-пі-ай"],
  [word("SPI"), "ес-пі-ай"],
  [word("CPI"), "сі-пі-ай"],
  [word("leading", "giu"), "лідинг"],
  [word("lagging", "giu"), "легінг"],
  [word("Risk"), "ріск"],
  [word("Assumption"), "есамшн"],
  [word("Issue"), "іш’ю"],
  [word("Dependency"), "діпенденсі"],
  [word("ТЗ"), "те-зе"],
  [word("ЗІ"), "зе-і"],
  [word("ПЗ"), "пе-зе"],
  [word("МВО"), "ем-ве-о"],
  [word("0,73"), "нуль цілих сімдесят три сотих"],
  [word("0,8"), "нуль цілих вісім десятих"],
  [/15 із 50/gu, "п’ятнадцять із п’ятдесяти"],
  [/40%/gu, "сорок відсотків"],
  [/45%/gu, "сорок п’ять відсотків"],
  [/90%/gu, "дев’яносто відсотків"],
];

export const toVoice = makeToVoice(PRONUNCIATION);
