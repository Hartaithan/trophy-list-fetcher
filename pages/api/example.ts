import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { EXAMPLE_TARGET } from "@/models/ExampleModel";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.query as { query: EXAMPLE_TARGET };
  let filename = "";
  switch (query) {
    case EXAMPLE_TARGET.PS4:
      filename = "/ps4.json";
      break;
    case EXAMPLE_TARGET.PS5:
      filename = "/ps5.json";
      break;
    case EXAMPLE_TARGET.Base:
      filename = "/base.json";
      break;
    case EXAMPLE_TARGET.DLC:
      filename = "/dlc.json";
      break;
    case EXAMPLE_TARGET.NoPlatinum:
      filename = "/no-platinum.json";
      break;
    default:
      filename = "/base.json";
      break;
  }
  const jsonDirectory = path.join(process.cwd(), "json");
  const fileContents = await fs.readFile(jsonDirectory + filename, "utf8");
  return res.status(200).json(fileContents);
};

export default handler;
