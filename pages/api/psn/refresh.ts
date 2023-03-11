import { NextApiRequest, NextApiResponse } from "next";
import { AuthTokensResponse, exchangeRefreshTokenForAuthTokens } from "psn-api";

interface ITokenQueries {
  [key: string]: string | string[];
  refresh_token: string;
}

const refreshAccessToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { refresh_token } = req.query as ITokenQueries;

  let authorization: AuthTokensResponse | null = null;

  try {
    authorization = await exchangeRefreshTokenForAuthTokens(refresh_token);
  } catch (error) {
    console.error("refresh access token error", error);
    return res.status(400).json({ message: "unable to refresh access token" });
  }

  return res.status(200).json({ authorization });
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
