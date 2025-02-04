import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import SessionHandler from "./(server)/(utils)/sessionHandler";

export async function middleware(req: NextRequest) {
  const sessionId =
    req.cookies.get("sessionId")?.value || req.headers.get("x-session-id");
  const { pathname } = req.nextUrl;

  try {
    if (sessionId) {
      const user = await SessionHandler.validateSession(sessionId);

      if (user) {
        if (pathname.startsWith("/login")) {
          return NextResponse.redirect(new URL("/pinboard", req.url));
        }

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user", JSON.stringify(user));

        return NextResponse.next({ request: { headers: requestHeaders } });
      }
    }
  } catch (err) {
    console.error("Invalid session:", err);
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("sessionId");
    return response;
  }

  if (!sessionId && pathname !== "/login" && pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
