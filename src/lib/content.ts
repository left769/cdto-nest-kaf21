import fs from "node:fs";
import path from "node:path";

export interface Lesson {
  slug: string;
  title: string;
  themeNumber: number;
  themeTitle: string;
  lessonNumber: number;
  typeLabel: string;
  body: string;
}

export interface Theme {
  number: number;
  title: string;
  lessons: Lesson[];
}

const LESSONS_DIR = path.join(process.cwd(), "lessons");

// Every lesson file starts with:
// # <Title>
//
// *Тема <N>: <Theme title> · Заняття <M>*
const HEADER_PATTERN =
  /^#\s+(.+)\n\n\*Тема\s+(\d+):\s*(.+?)\s*·\s*Заняття\s+(\d+)\*\n\n?/;

function typeLabelFor(filename: string): string {
  const hasLecture = filename.includes("Lecture");
  const hasSeminar = filename.includes("Seminar");
  const hasPractical = filename.includes("Practical");
  if (hasLecture && hasPractical) return "Лекція-практикум";
  if (hasSeminar) return "Семінар";
  if (hasLecture) return "Лекція";
  if (hasPractical) return "Практичне";
  return "Заняття";
}

function parseLessonFile(filename: string): Lesson | null {
  const raw = fs.readFileSync(path.join(LESSONS_DIR, filename), "utf-8");
  const match = raw.match(HEADER_PATTERN);
  if (!match) return null;
  const [, title, themeNumber, themeTitle, lessonNumber] = match;
  return {
    slug: filename.replace(/\.md$/, ""),
    title: title.trim(),
    themeNumber: Number(themeNumber),
    themeTitle: themeTitle.trim(),
    lessonNumber: Number(lessonNumber),
    typeLabel: typeLabelFor(filename),
    body: raw.slice(match[0].length).trimStart(),
  };
}

let cachedLessons: Lesson[] | null = null;

export function getAllLessons(): Lesson[] {
  if (cachedLessons && process.env.NODE_ENV === "production") {
    return cachedLessons;
  }
  const files = fs
    .readdirSync(LESSONS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md");
  const lessons = files
    .map(parseLessonFile)
    .filter((l): l is Lesson => l !== null)
    .sort((a, b) => a.themeNumber - b.themeNumber || a.lessonNumber - b.lessonNumber);
  cachedLessons = lessons;
  return lessons;
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return getAllLessons().find((l) => l.slug === slug);
}

export function getCourseThemes(): Theme[] {
  const lessons = getAllLessons();
  const themeMap = new Map<number, Theme>();
  for (const lesson of lessons) {
    if (!themeMap.has(lesson.themeNumber)) {
      themeMap.set(lesson.themeNumber, {
        number: lesson.themeNumber,
        title: lesson.themeTitle,
        lessons: [],
      });
    }
    themeMap.get(lesson.themeNumber)!.lessons.push(lesson);
  }
  return Array.from(themeMap.values()).sort((a, b) => a.number - b.number);
}

export function getAdjacentLessons(slug: string): {
  prev: Lesson | null;
  next: Lesson | null;
} {
  const lessons = getAllLessons();
  const idx = lessons.findIndex((l) => l.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? lessons[idx - 1] : null,
    next: idx < lessons.length - 1 ? lessons[idx + 1] : null,
  };
}
