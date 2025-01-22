import { NextResponse } from "next/server";
import { createTable } from "../../helpers/create-table";

export async function POST(req: Request) {
  const { title, userId } = await req.json();

  try {
    const table = await createTable(title, userId);
    return NextResponse.json({ message: "Table created successfully", table });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
