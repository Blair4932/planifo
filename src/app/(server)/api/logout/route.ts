import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("sessionId")?.value;
    if (sessionId)
      if (!sessionId) {
        return NextResponse.json(
          { error: "No session found" },
          { status: 400 }
        );
      }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    await prisma.session.delete({
      where: { id: sessionId },
    });

    const response = NextResponse.json({
      message: "Logged out successfully",
    });

    response.cookies.delete("sessionId");

    return response;
  } catch (error) {
    console.error("Error during logout:", error.message, error.stack);
    return NextResponse.json(
      { error: "Something went wrong during logout" },
      { status: 500 }
    );
  }
}
