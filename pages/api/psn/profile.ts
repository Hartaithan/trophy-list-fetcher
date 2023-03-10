import { NextApiRequest, NextApiResponse } from "next";
import { AuthorizationPayload, getProfileFromUserName } from "psn-api";
import { getCookie } from "cookies-next";
import { getErrorMessage } from "@/helpers/error";

const getProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  const options = { req, res };
  const access_token = getCookie("access_token", options) as string;
  const authorization: AuthorizationPayload = { accessToken: access_token };
  try {
    const { profile } = await getProfileFromUserName(authorization, "me");
    return res.status(200).json({ profile });
  } catch (error) {
    console.error("unable to get profile", error);
    const { message } = getErrorMessage(error, "Unable to get profile");
    return res.status(400).json({ message });
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
