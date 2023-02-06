import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { EXAMPLE_TARGET, SEARCH_RESULTS } from "@/models/ExampleModel";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, search } = req.query as {
    query: EXAMPLE_TARGET;
    search: SEARCH_RESULTS;
  };
  let filename = "";
  if (query && !search) {
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
  }
  if (!query && search) {
    switch (search) {
      case SEARCH_RESULTS.One:
        filename = "/search-one.json";
        break;
      case SEARCH_RESULTS.Two:
        filename = "/search-two.json";
        break;
      case SEARCH_RESULTS.Three:
        filename = "/search-three.json";
        break;
      case SEARCH_RESULTS.Four:
        filename = "/search-four.json";
        break;
      case SEARCH_RESULTS.Five:
        filename = "/search-five.json";
        break;
      default:
        filename = "/search-one.json";
        break;
    }
  }
  if (query && search) {
    return res.status(400).json({
      message: "You cannot use two types of examples at the same time.",
    });
  }
  const jsonDirectory = path.join(process.cwd(), "json");
  const fileContents = await fs.readFile(jsonDirectory + filename, "utf8");
  return res.status(200).json(fileContents);
};

export default handler;
