import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "production"
    ? undefined
    : "development-secret-aplikasi-nilai-lsp");

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: authSecret });
  const isLoggedIn = Boolean(token);
  const role = token?.role;

  if (!isLoggedIn && nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && nextUrl.pathname === "/login") {
    const dashboardUrl =
      role === "ADMIN" ? "/admin" : role === "GURU" ? "/guru" : "/siswa";
    return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
  }

  if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/guru") && role !== "GURU") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/siswa") && role !== "SISWA") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
