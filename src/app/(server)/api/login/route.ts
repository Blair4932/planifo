import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/prisma/lib/prisma";
import SessionHandler from "../../(utils)/sessionHandler";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        notes: true,
        tables: true,
        events: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const existingSession = await prisma.session.findFirst({
      where: { userId: user.id },
    });

    if (existingSession) {
      console.log("EXISTING SESSION", existingSession);
      await prisma.session.delete({
        where: { id: existingSession.id },
      });
    }

    const sessionId = await SessionHandler.createSession(user);

    const response = NextResponse.json({
      message: "Login successful",
    });

    response.cookies.set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error.message, error.stack);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
