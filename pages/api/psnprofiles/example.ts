import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { EXAMPLE_TARGET, SEARCH_RESULTS } from "@/models/ExampleModel";

interface IExampleQueries {
  [key: string]: string | string[];
  query: EXAMPLE_TARGET;
  search: SEARCH_RESULTS;
}

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

const getExample = async (req: NextApiRequest, res: NextApiResponse) => {
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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return getExample(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
