import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function GET(req: Request, { params }: any) {
  const { id } = await params;

  try {
    const note = await prisma.note.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
