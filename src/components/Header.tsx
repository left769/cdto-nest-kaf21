import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getCourseThemes } from "@/lib/content";
import { getCompletedSlugs } from "@/lib/progress";
import { SignOutButton } from "@/components/SignOutButton";

export async function Header() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const themes = getCourseThemes();
  const completed = await getCompletedSlugs(session.user.id);
  const totalLessons = themes.reduce((sum, t) => sum + t.lessons.length, 0);
  const completedCount = themes.reduce(
    (sum, t) => sum + t.lessons.filter((l) => completed.has(l.slug)).length,
    0,
  );
  const percent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="CDTO"
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
          <span className="text-sm font-semibold tracking-tight">CDTO</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-500">{session.user.email}</span>
          <SignOutButton />
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 pb-3">
        <div className="flex gap-1">
          {themes.map((theme) => (
            <div key={theme.number} className="flex flex-1 gap-0.5">
              {theme.lessons.map((lesson) => (
                <span
                  key={lesson.slug}
                  title={`Тема ${theme.number}: ${theme.title} · ${lesson.title}${
                    completed.has(lesson.slug) ? " (пройдено)" : ""
                  }`}
                  className={`h-1.5 flex-1 rounded-full ${
                    completed.has(lesson.slug)
                      ? "bg-emerald-500"
                      : "bg-neutral-200 dark:bg-neutral-800"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-neutral-400">
          {completedCount} / {totalLessons} занять · {percent}%
        </p>
      </div>
    </header>
  );
}
