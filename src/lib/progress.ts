import { prisma } from "@/lib/prisma";

export async function getCompletedSlugs(userId: string): Promise<Set<string>> {
  const rows = await prisma.progress.findMany({
    where: { userId },
    select: { lessonSlug: true },
  });
  return new Set(rows.map((r) => r.lessonSlug));
}
