import { NextResponse } from "next/server";
import { registerUser } from "../../helpers/register";

export async function POST(req: Request) {
  const { username, password, email } = await req.json();

  try {
    const user = await registerUser(username, password, email);
    return NextResponse.json({ message: "User registered successfully", user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  //empty commit
}
