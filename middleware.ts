import { NextRequest, NextResponse } from "next/server";
import {
  getProfileFromUserName,
  AuthorizationPayload,
  ProfileFromUserNameResponse,
} from "psn-api";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  const access_token = req.cookies.get("access_token")?.value;
  let response: ProfileFromUserNameResponse | null = null;

  if (access_token) {
    const authorization: AuthorizationPayload = { accessToken: access_token };
    try {
      response = await getProfileFromUserName(authorization, "me");
    } catch (error) {
      console.error("unable to get profile", error);
    }
  }

  const isAuth = response && access_token;
  const isSignIn = req.nextUrl.pathname.startsWith("/psn/signIn");

  if ((isAuth && !isSignIn) || (!isAuth && isSignIn)) {
    return res;
  }

  const redirectUrl = req.nextUrl.clone();
  if (isAuth && isSignIn) {
    redirectUrl.pathname = "/psn";
  } else {
    redirectUrl.pathname = "/psn/signIn";
  }

  return NextResponse.redirect(redirectUrl);
};

export const config = {
  matcher: "/psn/:path*",
};