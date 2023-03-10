import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import {
  TROPHY_LISTS,
  SEARCH_RESULTS,
  EXAMPLE_TARGET,
} from "@/models/ExampleModel";

interface IExampleQueries {
  [key: string]: string | string[];
  target: EXAMPLE_TARGET;
  query: TROPHY_LISTS | SEARCH_RESULTS;
}

const pickExample = (
  target: EXAMPLE_TARGET,
  query: TROPHY_LISTS | SEARCH_RESULTS
): string | null => {
  switch (target) {
    case "trophy-list":
      if (!Object.values(TROPHY_LISTS).includes(query as TROPHY_LISTS)) {
        return null;
      }
      return `/${query}.json`;
    case "search":
      if (!Object.values(SEARCH_RESULTS).includes(query as SEARCH_RESULTS)) {
        return null;
      }
      return `/${query}.json`;
    default:
      return null;
  }
};

const getExample = async (req: NextApiRequest, res: NextApiResponse) => {
  const { target, query } = req.query as IExampleQueries;
  if (!target) {
    return res.status(400).json({ message: "Target is required" });
  }
  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }
  if (query && query.trim().length === 0) {
    return res.status(400).json({ message: "Query cannot be empty" });
  }
  const filename = pickExample(target, query);
  if (!filename) {
    return res.status(400).json({
      message: `The requested ${target} example does not exist.`,
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
