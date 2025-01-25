import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (
      !id ||
      !body ||
      !Array.isArray(body.columns) ||
      !Array.isArray(body.rows)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid request data. Ensure 'id', 'columns', and 'rows' are included.",
        },
        { status: 400 }
      );
    }

    const { title, columns, rows } = body;

    for (const column of columns) {
      if (!column.id || !column.header) {
        throw new Error(`Column is missing required fields: id or header.`);
      }

      if (!Array.isArray(column.cells)) {
        throw new Error(`Column cells must be an array.`);
      }

      for (const cell of column.cells) {
        if (!cell.id || !cell.rowId || !cell.columnId) {
          let celllll = JSON.stringify(cell);
          throw new Error(
            ` Cell is missing required fields: id, value, rowId, or columnId. ${celllll}`
          );
        }
      }
    }

    for (const row of rows) {
      if (!row.id || !Array.isArray(row.cells)) {
        throw new Error(`Row is missing required fields: id or cells.`);
      }

      for (const cell of row.cells) {
        if (!cell.id || !cell.rowId || !cell.columnId) {
          throw new Error(
            `Cell is missing required fields: id, value, rowId, or columnId.`
          );
        }
      }
    }

    const updatedTable = await prisma.table.update({
      where: { id },
      data: {
        title,
        columns: {
          upsert: columns.map((column) => ({
            where: { id: column.id },
            create: {
              header: column.header,
              columnIndex: column.columnIndex,
              cells: {
                create: column.cells.map((cell) => ({
                  id: cell.id,
                  value: cell.value,
                  backgroundColor: cell.backgroundColor,
                  rowId: cell.rowId,
                })),
              },
            },
            update: {
              header: column.header,
              columnIndex: column.columnIndex,
              cells: {
                upsert: column.cells.map((cell) => ({
                  where: { id: cell.id },
                  create: {
                    value: cell.value,
                    backgroundColor: cell.backgroundColor,
                    rowId: cell.rowId,
                  },
                  update: {
                    value: cell.value,
                    backgroundColor: cell.backgroundColor,
                  },
                })),
              },
            },
          })),
        },
        rows: {
          upsert: rows.map((row) => ({
            where: { id: row.id },
            create: {
              rowIndex: row.rowIndex,
              cells: {
                create: row.cells.map((cell) => ({
                  id: cell.id,
                  value: cell.value,
                  backgroundColor: cell.backgroundColor,
                  columnId: cell.columnId,
                })),
              },
            },
            update: {
              rowIndex: row.rowIndex,
              cells: {
                upsert: row.cells.map((cell) => ({
                  where: { id: cell.id },
                  create: {
                    value: cell.value,
                    backgroundColor: cell.backgroundColor,
                    columnId: cell.columnId,
                  },
                  update: {
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
