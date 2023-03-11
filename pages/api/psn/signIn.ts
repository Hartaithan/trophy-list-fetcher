import { getErrorMessage } from "@/helpers/error";
import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import {
  exchangeNpssoForCode,
  exchangeCodeForAccessToken,
  AuthTokensResponse,
} from "psn-api";

interface ISignInBody {
  npsso: string;
}

const signIn = async (req: NextApiRequest, res: NextApiResponse) => {
  const { npsso } = req.body as ISignInBody;

  let accessCode: string | null = null;
  let authorization: AuthTokensResponse | null = null;

  try {
    accessCode = await exchangeNpssoForCode(npsso);
  } catch (error) {
    console.error("exchange access code error", error);
    const { message } = getErrorMessage(error, "Unable to get access code");
    return res.status(400).json({ message });
  }

  try {
    authorization = await exchangeCodeForAccessToken(accessCode);
  } catch (error) {
    console.error("exchange access token error", error);
    const { message } = getErrorMessage(error, "Unable to get access token");
    return res.status(400).json({ message });
  }

  const options = { req, res };
  const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
    authorization;
  setCookie("access_token", accessToken, { ...options, maxAge: expiresIn });
  setCookie("refresh_token", refreshToken, {
    ...options,
    maxAge: refreshTokenExpiresIn,
  });

  return res.status(200).json({ message: "Successful sign in!" });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST":
      return signIn(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
