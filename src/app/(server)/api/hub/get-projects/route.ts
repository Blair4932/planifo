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
    const projects = await prisma.project.findMany({
      where: { userId },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects." },
      { status: 500 }
    );
  }
}
