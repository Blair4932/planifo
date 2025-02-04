import { NextRequest, NextResponse } from "next/server";
import SessionHandler from "../../(utils)/sessionHandler";

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get("sessionId")?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "No sessionId found" }, { status: 401 });
  }

  try {
    const user = await SessionHandler.validateSession(sessionId);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Error during session validation:", err);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
