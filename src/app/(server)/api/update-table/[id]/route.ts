import { NextResponse } from "next/server";
import prisma from "@/src/app/prisma/lib/prisma";

export async function PUT(req: Request, context: any) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "ID parameter is required." },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    if (!body || !body.title || !body.columns || !body.rows) {
      return NextResponse.json(
        {
          error:
            "Invalid request data. Ensure the body contains 'title', 'columns', and 'rows'.",
        },
        { status: 400 }
      );
    }

    const { title, columns, rows } = body;

    const updatedTable = await prisma.table.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        columns: {
          update: columns.map((column: any) => ({
            where: { id: column.id },
            data: {
              header: column.header,
              cells: {
                update: column.cells.map((cell: any) => ({
                  where: { id: cell.id },
                  data: {
                    value: cell.value,
                    backgroundColor: cell.backgroundColor,
                  },
                })),
              },
            },
          })),
        },
        rows: {
          update: rows.map((row: any) => ({
            where: { id: row.id },
            data: {
              cells: {
                update: row.cells.map((cell: any) => ({
                  where: { id: cell.id },
                  data: {
                    value: cell.value,
                    backgroundColor: cell.backgroundColor,
                  },
                })),
              },
            },
          })),
        },
      },
    });

    return NextResponse.json({ table: updatedTable });
  } catch (error) {
    console.error("Error updating table:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
