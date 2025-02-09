import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return NextResponse.json({
      message: "Password updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error during password update:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
