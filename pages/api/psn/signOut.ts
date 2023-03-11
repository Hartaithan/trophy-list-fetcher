import { getErrorMessage } from "@/helpers/error";
import { deleteCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

const signOut = async (req: NextApiRequest, res: NextApiResponse) => {
  const options = { req, res };

  try {
    deleteCookie("access_token", options);
    deleteCookie("refresh_token", options);
    return res.status(200).json({ message: "Successful sign out!" });
  } catch (error) {
    const { message } = getErrorMessage(error, "Unable to sign out");
    return res.status(400).json({ message });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return signOut(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
