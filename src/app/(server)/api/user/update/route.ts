import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/lib/prisma";
import bcrypt from "bcrypt";

export async function PUT(req: NextRequest) {
  try {
    const { id, username, email, password } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const sessionId = req.cookies.get("sessionId")?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const updateData: any = {
        username,
        email,
      };

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      return NextResponse.json(updatedUser);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error during user update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
