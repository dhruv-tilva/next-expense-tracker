// middleware.js

import Cookies from "js-cookie";
import { NextResponse } from "next/server";

const publicRoutes = ["sign-in", "sign-up", "/"];
const privateRoutes = ["/home", "/profile"];

const isPrivateRoute = (path) => {
  return !!privateRoutes.some((r) => path.startsWith(r));
};

export const config = {
  matcher: ["/", "/home", "/sign-in", "/sign-up", "/profile"],
};
export async function middleware(request) {
  const _isLogin = await request.cookies.get("token")?.value;
  const _user = JSON.parse(
    (await request.cookies.get("user")?.value) ?? JSON.stringify("")
  );
  const { pathname } = request.nextUrl;
  const searchParams = request?.nextUrl?.searchParams;

  switch (request.nextUrl.pathname) {
    case "/home":
      if (_user && _isLogin) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

    default:
      if (isPrivateRoute(request.nextUrl.pathname)) {
        if (_user && _isLogin) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }
      } else if (publicRoutes.includes(request.nextUrl.pathname)) {
        if (_user && _isLogin) {
          return NextResponse.redirect(new URL("/home", request.url));
        } else {
          return NextResponse.next();
        }
      } else {
        return NextResponse.next();
      }
  }

  //   if (!loggedin && pathname !== "/signin") {
  //     return NextResponse.redirect(new URL("/signin", req.url));
  //   }
}
