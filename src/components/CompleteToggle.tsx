"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function CompleteToggle({
  slug,
  initialCompleted,
}: {
  slug: string;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const next = !completed;
    setCompleted(next);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, completed: next }),
      });
    } finally {
      startTransition(() => router.refresh());
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
        completed
          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-neutral-300 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300"
      }`}
    >
      {completed ? "✓ Пройдено" : "Позначити як пройдено"}
    </button>
  );
}
