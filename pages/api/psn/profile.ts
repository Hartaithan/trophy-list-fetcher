import { NextApiRequest, NextApiResponse } from "next";
import { AuthorizationPayload, getProfileFromUserName } from "psn-api";
import { getCookie } from "cookies-next";

const getProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  const options = { req, res };
  const access_token = getCookie("access_token", options) as string;
  const authorization: AuthorizationPayload = { accessToken: access_token };
  try {
    const { profile } = await getProfileFromUserName(authorization, "me");
    return res.status(200).json({ profile });
  } catch (error) {
    console.error("unable to get profile", error);
    return res.status(400).json({ message: "Unable to get profile" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return getProfile(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
