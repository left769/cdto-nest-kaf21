import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLessonBySlug } from "@/lib/content";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  const completed = Boolean(body?.completed);

  if (!slug || !getLessonBySlug(slug)) {
    return NextResponse.json({ error: "Заняття не знайдено" }, { status: 404 });
  }

  const userId = session.user.id;

  if (completed) {
    await prisma.progress.upsert({
      where: { userId_lessonSlug: { userId, lessonSlug: slug } },
      update: {},
      create: { userId, lessonSlug: slug },
    });
  } else {
    await prisma.progress.deleteMany({
      where: { userId, lessonSlug: slug },
    });
  }

  return NextResponse.json({ ok: true, completed });
}
