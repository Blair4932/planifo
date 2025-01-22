import prisma from "@/src/app/prisma/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    if (!id) {
      NextResponse.json({ error: "Table Id required" }, { status: 400 });
    }

    await prisma.table.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json(
      { message: "Table deleted successfully " },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error deleting note:", e);

    return NextResponse.json(
      { error: "Failed to delete the table." },
      { status: 500 }
    );
  }
}
