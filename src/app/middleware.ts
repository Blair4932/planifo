import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user", JSON.stringify(decoded));

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      if (pathname === "/") {
        return NextResponse.redirect(new URL("/pinboard", req.url));
      }

      return response;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
