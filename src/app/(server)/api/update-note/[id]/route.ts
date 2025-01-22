import { NextResponse } from "next/server";
import prisma from "@/src/app/prisma/lib/prisma";

export async function PUT(req: Request, { params }: any) {
  const { id } = params;

  try {
    const { content } = await req.json();

    if (!content || !id) {
      return NextResponse.json(
        { error: "Invalid request data." },
        { status: 400 }
      );
    }

    const updatedNote = await prisma.note.update({
      where: { id: parseInt(id, 10) },
      data: { content },
    });

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
