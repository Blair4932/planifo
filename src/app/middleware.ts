import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value; // Retrieve the token from cookies
  const { pathname } = req.nextUrl;

  // Check if the user is logged in
  if (token) {
    try {
      // Verify the token and extract user information
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("User info decoded from JWT:", decoded);

      // Attach the user info to the request object (e.g., decoded.user)
      req.user = decoded; // Now TypeScript knows that req.user exists

      // If the user is logged in and visits `/`, redirect to `/pinboard`
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/pinboard", req.url));
      }
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  // If the user is not logged in and requests `/`, redirect to `/login`
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Continue the request if the token is valid or no token is required
  return NextResponse.next();
}
