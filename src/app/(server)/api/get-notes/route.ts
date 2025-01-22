import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function GET(req: Request) {
  const userId = req.headers.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required to fetch notes." },
      { status: 400 }
    );
  }

  try {
    const notes = await prisma.note.findMany({
      where: { userId: parseInt(userId) },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes." },
      { status: 500 }
    );
  }
}
