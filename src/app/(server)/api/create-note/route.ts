import { NextResponse } from "next/server";
import { createNote } from "../../helpers/create-note";

export async function POST(req: Request) {
  const { title, content, userId } = await req.json();

  try {
    const note = await createNote(title, content, userId);
    return NextResponse.json({ message: "Note created successfully", note });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
