import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("User info decoded from JWT:", decoded);

      req.user = decoded;

      if (pathname === "/") {
        return NextResponse.redirect(new URL("/pinboard", req.url));
      }
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
