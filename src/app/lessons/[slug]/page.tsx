import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { auth } from "@/lib/auth";
import { getAdjacentLessons, getAllLessons, getLessonBySlug } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { CompleteToggle } from "@/components/CompleteToggle";

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonPage({
  params,
}: {
  params: { slug: string };
}) {
  const lesson = getLessonBySlug(params.slug);
  if (!lesson) notFound();

  const session = await auth();
  const userId = session?.user?.id;
  const progress = userId
    ? await prisma.progress.findUnique({
        where: { userId_lessonSlug: { userId, lessonSlug: lesson.slug } },
      })
    : null;
  const { prev, next } = getAdjacentLessons(lesson.slug);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← До курсу
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
        <span>
          Тема {lesson.themeNumber}: {lesson.themeTitle}
        </span>
        <span>·</span>
        <span>{lesson.typeLabel}</span>
      </div>
      <h1 className="mt-2 text-2xl font-semibold">{lesson.title}</h1>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.body}</ReactMarkdown>
      </div>

      <div className="mt-10 flex flex-col gap-6 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
        {userId && (
          <CompleteToggle slug={lesson.slug} initialCompleted={!!progress} />
        )}
        <div className="flex justify-between gap-4 text-sm sm:justify-end">
          {prev && (
            <Link
              href={`/lessons/${prev.slug}`}
              className="text-neutral-500 hover:underline"
            >
              ← {prev.title}
            </Link>
          )}
          {next && (
            <Link
              href={`/lessons/${next.slug}`}
              className="text-neutral-500 hover:underline"
            >
              {next.title} →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
