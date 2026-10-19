// Таблиця вимови для синтезу (бриф Т2·З5, розділ 6). Субтитри не змінюються.
// Після першої згенерованої сцени прослухати й за потреби уточнити.

import { makeToVoice, PronunciationTable, word } from "../../shared/pronunciation";

export const PRONUNCIATION: PronunciationTable = [
  [/К — це Must, И — Should, Ї — Could, В — Won’t/gu, "Ка — це маст, И — шуд, Ї — куд, Ве — воунт"],
  [/«КИЇВ»/gu, "«Київ»"],
  [word("Must"), "маст"],
  [word("Should"), "шуд"],
  [word("Could"), "куд"],
  [word("Won’t"), "воунт"],
  [word("cost of delay", "giu"), "кост-оф-ділей"],
  [word("capacity planning", "giu"), "кепесіті-планінг"],
  [word("capacity plan", "giu"), "кепесіті-план"],
  [word("vendor lock-in", "giu"), "вендор-лок-ін"],
  [word("lock-in", "giu"), "лок-ін"],
  [word("storming", "giu"), "сторминг"],
  [word("bottleneck", "giu"), "ботлнек"],
  [word("ROI"), "ер-оу-ай"],
  [word("CPI"), "сі-пі-ай"],
  [word("SLA"), "ес-ел-ей"],
  [word("ЦТ"), "це-те"],
  [word("ЗСУ"), "зе-ес-у"],
  [word("ТЗ"), "те-зе"],
  [/60–80%/gu, "шістдесят–вісімдесят відсотків"],
  [/5–7 хвилин/gu, "п’ять–сім хвилин"],
  [/Додатках 1–3/gu, "Додатках з першого по третій"],
  [/2–3/gu, "дві–три"],
];

export const toVoice = makeToVoice(PRONUNCIATION);
