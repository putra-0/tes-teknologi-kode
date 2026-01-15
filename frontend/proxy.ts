import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, errors } from "jose";

const PUBLIC_PATHS = ["/", "/login", "/signup"];
const LOGIN_PATH = "/login";
const DASHBOARD_PATH = "/dashboard";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const token = request.cookies.get("session")?.value;

  const isSafeMethod = method === "GET" || method === "HEAD";

  const clearSession = (res: NextResponse) => {
    res.cookies.delete("session");
    return res;
  };

  const redirectWithClear = (path: string) => {
    const res = NextResponse.redirect(new URL(path, request.url));
    return clearSession(res);
  };

  const verifyToken = async () => {
    if (!token) throw new Error("NO_TOKEN");

    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
  };

  /* ================= PUBLIC ROUTES ================= */

  if (PUBLIC_PATHS.includes(pathname)) {
    if (token && isSafeMethod) {
      try {
        // sudah login → jangan balik ke login
        await verifyToken();
        return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
      } catch {
        // token invalid / expired
        return clearSession(NextResponse.next());
      }
    }

    return NextResponse.next();
  }

  /* ================= PROTECTED ROUTES ================= */

  // belum login → paksa ke login
  if (!token) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  try {
    await verifyToken();
    return NextResponse.next();
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      return redirectWithClear(LOGIN_PATH);
    }

    return redirectWithClear(LOGIN_PATH);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
};
