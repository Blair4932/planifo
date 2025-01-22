import { NextResponse } from "next/server";
import prisma from "@/src/app/prisma/lib/prisma";

export async function GET(req: Request, { params }: any) {
  const { id } = await params;

  try {
    const table = await prisma.table.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        rows: {
          include: {
            cells: true,
          },
        },
        columns: {
          include: {
            cells: true,
          },
        },
      },
    });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    return NextResponse.json({ table });
  } catch (error) {
    console.error("Error fetching table:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
