import { NextResponse } from "next/server";

import { auth } from "./app/auth";

const PROTECTED_PATHS = [
  "/dashboard",
  "/compose",
];

const AUTH_PATHS = [
  "/login",
  "/signup",
];

export default auth((req) => {
  const { pathname, search } =
    req.nextUrl;

  const isProtected =
    PROTECTED_PATHS.some(
      (path) =>
        pathname === path ||
        pathname.startsWith(`${path}/`),
    );

  const isAuthPage = AUTH_PATHS.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(`${path}/`),
  );

  const isLoggedIn = !!req.auth;

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL(
      "/login",
      req.url,
    );

    loginUrl.searchParams.set(
      "callbackUrl",
      `${pathname}${search}`,
    );

    return NextResponse.redirect(
      loginUrl,
    );
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",

    "/compose",
    "/compose/:path*",

    "/login",
    "/signup",
  ],
};