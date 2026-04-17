import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/login", "/register", "/forgot-password"]);

const PROTECTED_PREFIX = [
  "/",
  "/dashboard",
  "/finance",
  "/hr",
  "/ops",
  "/chat",
  "/settings",
];

function isProtectedPath(pathname: string): boolean {
  return (
    PROTECTED_PREFIX.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    ) && !PUBLIC_PATHS.has(pathname)
  );
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get("access_token")?.value ??
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
