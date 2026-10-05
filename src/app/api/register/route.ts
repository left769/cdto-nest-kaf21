import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const groupName = typeof body?.group === "string" ? body.group.trim() : "";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Некоректний email" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Пароль має містити щонайменше 8 символів" },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Користувач з таким email вже зареєстрований" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);

  const group = groupName
    ? await prisma.group.upsert({
        where: { name: groupName },
        update: {},
        create: { name: groupName },
      })
    : null;

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      groupId: group?.id,
    },
  });

  return NextResponse.json({ ok: true });
}
