import { NextApiRequest, NextApiResponse } from "next";
import {
  exchangeNpssoForCode,
  exchangeCodeForAccessToken,
  AuthTokensResponse,
} from "psn-api";

interface ITokenQueries {
  [key: string]: string | string[];
  npsso: string;
}

const exchangeNpssoForAccessToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { npsso } = req.query as ITokenQueries;

  let accessCode: string | null = null;
  let authorization: AuthTokensResponse | null = null;

  try {
    accessCode = await exchangeNpssoForCode(npsso);
  } catch (error) {
    console.error("exchange access code error", error);
    return res.status(400).json({ message: "unable to get access code" });
  }

  try {
    authorization = await exchangeCodeForAccessToken(accessCode);
  } catch (error) {
    console.error("exchange access token error", error);
    return res.status(400).json({ message: "unable to get access token" });
  }

  return res.status(200).json({ authorization });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return exchangeNpssoForAccessToken(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
