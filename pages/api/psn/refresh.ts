import { getErrorMessage } from "@/helpers/error";
import { NextApiRequest, NextApiResponse } from "next";
import { getCookie, setCookie } from "cookies-next";
import { AuthTokensResponse, exchangeRefreshTokenForAuthTokens } from "psn-api";

const refreshAccessToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const options = { req, res };
  let authorization: AuthTokensResponse | null = null;
  const refresh_token = getCookie("refresh_token", options) as string;

  try {
    authorization = await exchangeRefreshTokenForAuthTokens(refresh_token);
  } catch (error) {
    console.error("refresh access token error", error);
    const { message } = getErrorMessage(error, "Unable to refresh token");
    return res.status(400).json({ message });
  }

  const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
    authorization;
  setCookie("access_token", accessToken, { ...options, maxAge: expiresIn });
  setCookie("refresh_token", refreshToken, {
    ...options,
    maxAge: refreshTokenExpiresIn,
  });

  return res.status(200).json({ message: "Tokens successfully refreshed!" });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return refreshAccessToken(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
