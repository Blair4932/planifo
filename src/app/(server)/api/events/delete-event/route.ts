import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing event Id" }, { status: 400 });
    }

    const event = await prisma.event.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Event deleted successfully", event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
