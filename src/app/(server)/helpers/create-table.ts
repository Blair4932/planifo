import prisma from "@/prisma/lib/prisma";
import { NextResponse } from "next/server";

export async function createTable(title: string, userId: string) {
  if (!title) {
    throw new Error("Failed to create table: Table title is required");
  } else if (!userId) {
    throw new Error("Failed to create table: Error getting userId");
  }

  try {
    const table = await prisma.table.create({
      data: { title: title, userId: userId },
    });

    const rows = await Promise.all(
      Array.from({ length: 5 }).map((_, rowIndex) =>
        prisma.row.create({
          data: {
            tableId: table.id,
            rowIndex,
          },
        })
      )
    );

    const columns = await Promise.all(
      Array.from({ length: 5 }).map((_, columnIndex) =>
        prisma.column.create({
          data: {
            tableId: table.id,
            columnIndex,
            header: `Column ${columnIndex + 1}`,
          },
        })
      )
    );

    const cells = [];
    for (const row of rows) {
      for (const column of columns) {
        cells.push({
          rowId: row.id,
          columnId: column.id,
          value: "",
          backgroundColor: "#ffffff",
        });
      }
    }

    await prisma.cell.createMany({
      data: cells,
    });

    return NextResponse.json({
      table,
      rows,
      columns,
    });
  } catch (e) {
    console.error("Error creating table:", e);
    return NextResponse.json(
      { error: "An error occurred while creating the table." },
      { status: 500 }
    );
  }
}
