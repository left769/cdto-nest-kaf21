import Link from "next/link";
import { auth } from "@/lib/auth";
import { getCourseThemes } from "@/lib/content";
import { getCompletedSlugs } from "@/lib/progress";

export default async function HomePage() {
  const session = await auth();
  const themes = getCourseThemes();
  const completed = session?.user?.id
    ? await getCompletedSlugs(session.user.id)
    : new Set<string>();
  const totalLessons = themes.reduce((sum, t) => sum + t.lessons.length, 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Курс CDTO</h1>
      <p className="text-sm text-neutral-500 mb-8">
        {completed.size} / {totalLessons} занять пройдено
      </p>
      <div className="space-y-8">
        {themes.map((theme) => (
          <section key={theme.number}>
            <h2 className="text-sm font-medium text-neutral-500 mb-3">
              Тема {theme.number}. {theme.title}
            </h2>
            <ul className="space-y-1">
              {theme.lessons.map((lesson) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 px-4 py-3 text-sm transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          completed.has(lesson.slug)
                            ? "bg-emerald-500"
                            : "bg-neutral-300 dark:bg-neutral-700"
                        }`}
                      />
                      <span>{lesson.title}</span>
                    </span>
                    <span className="shrink-0 text-xs text-neutral-400">
                      {lesson.typeLabel}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
