import { NextApiRequest, NextApiResponse } from "next";
import { exchangeNpssoForCode, exchangeCodeForAccessToken } from "psn-api";

interface ITokenQueries {
  [key: string]: string | string[];
  npsso: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { npsso } = req.query as ITokenQueries;

  const accessCode = await exchangeNpssoForCode(npsso);
  const authorization = await exchangeCodeForAccessToken(accessCode);

  return res.status(200).json({ authorization });
};

export default handler;
