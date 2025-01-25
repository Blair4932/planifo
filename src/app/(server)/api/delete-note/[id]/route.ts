import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function DELETE(req: Request, { params }: any) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required." },
        { status: 400 }
      );
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Note deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting note:", error);

    return NextResponse.json(
      { error: "Failed to delete the note." },
      { status: 500 }
    );
  }
}
