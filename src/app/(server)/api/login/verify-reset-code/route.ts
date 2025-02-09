import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (
    !user ||
    user.resetToken !== code ||
    new Date() > user.resetTokenExpiry!
  ) {
    return NextResponse.json(
      { error: "Invalid or expired code." },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Code verified." }, { status: 200 });
}
