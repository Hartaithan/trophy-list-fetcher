import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { ExampleTarget, SearchResults } from "@/models/ExampleModel";

interface IExampleQueries {
  [key: string]: string | string[];
  query: ExampleTarget;
  search: SearchResults;
}

const pickTrophiesExample = (query: ExampleTarget) => {
  if (!Object.values(ExampleTarget).includes(query)) {
    return "/base.json";
  }
  return `/${query}.json`;
};

const pickSearchExample = (query: SearchResults) => {
  if (!Object.values(SearchResults).includes(query)) {
    return "/search-one.json";
  }
  return `/${query}.json`;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, search } = req.query as IExampleQueries;
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
