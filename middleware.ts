import { NextRequest, NextResponse } from "next/server";
import {
  getProfileFromUserName,
  AuthorizationPayload,
  ProfileFromUserNameResponse,
  exchangeRefreshTokenForAuthTokens,
  AuthTokensResponse,
} from "psn-api";

type NullableProfileResponse = ProfileFromUserNameResponse | null;
type NullableAuthResponse = AuthTokensResponse | null;

const getProfile = async (token: string): Promise<NullableProfileResponse> => {
  const authorization: AuthorizationPayload = { accessToken: token };
  let response: NullableProfileResponse = null;
  try {
    response = await getProfileFromUserName(authorization, "me");
  } catch (error) {
    console.error("unable to get profile", error);
  }
  return response;
};

const refreshTokens = async (
  res: NextResponse,
  token: string
): Promise<NullableAuthResponse> => {
  let authorization: NullableAuthResponse = null;
  try {
    authorization = await exchangeRefreshTokenForAuthTokens(token);
  } catch (error) {
    console.error("unable to refresh tokens", error);
  }
  if (authorization) {
    const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
      authorization;
    res.cookies.set("access_token", accessToken, { maxAge: expiresIn });
    res.cookies.set("refresh_token", refreshToken, {
      maxAge: refreshTokenExpiresIn,
    });
  }
  return authorization;
};

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  let access_token = req.cookies.get("access_token")?.value;
  let refresh_token = req.cookies.get("refresh_token")?.value;

  let response: NullableProfileResponse = null;

  if (access_token) {
    response = await getProfile(access_token);
  }

  if (!access_token && refresh_token) {
    const auth = await refreshTokens(res, refresh_token);
    if (auth) {
      access_token = auth.accessToken;
      refresh_token = auth.refreshToken;
      response = await getProfile(access_token);
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
