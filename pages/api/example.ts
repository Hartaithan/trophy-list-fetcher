import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { EXAMPLE_TARGET, SEARCH_RESULTS } from "@/models/ExampleModel";

const pickTrophiesExample = (query: EXAMPLE_TARGET) => {
  if (!Object.values(EXAMPLE_TARGET).includes(query)) {
    return "/base.json";
  }
  return `/${query}.json`;
};

const pickSearchExample = (query: SEARCH_RESULTS) => {
  if (!Object.values(SEARCH_RESULTS).includes(query)) {
    return "/search-one.json";
  }
  return `/${query}.json`;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, search } = req.query as {
    query: EXAMPLE_TARGET;
    search: SEARCH_RESULTS;
  };
  let filename = "";
  if (query && !search) {
    filename = pickTrophiesExample(query);
  }
  if (!query && search) {
    filename = pickSearchExample(search);
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
