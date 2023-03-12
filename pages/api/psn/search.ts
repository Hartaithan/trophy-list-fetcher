import {
  IPSNSearchResponse as ISearchResponse,
  ISearchResult,
} from "@/models/SearchModel";
import { NextApiRequest, NextApiResponse } from "next";

const SEARCH_URL = process.env.NEXT_PUBLIC_SEARCH_URL!;

interface ISearchQueries {
  [key: string]: string | string[];
  query: string;
}

const allowedPlatforms: string[] = ["PS5", "PS4", "PS3", "Vita"];

const searchByQuery = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.query as ISearchQueries;
  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }
  let results = null;
  try {
    results = await fetch(`${SEARCH_URL}/site_search_add?query=${query}`).then(
      (r) => r.json()
    );
  } catch (error) {
    console.error("search error", error);
    return res
      .status(400)
      .json({ message: `Unable to search by query: ${query}` });
  }
  let id = 1;
  const games: string[] = results?.games || [];
  const urls: string[] = results?.urls_g || [];
  const formattedGames = games.reduce((result, item, index) => {
    const name = item.replace(/ *\([^)]*\) */g, "");
    const platform = item.replace(/(^.*\(|\).*$)/g, "");
    if (allowedPlatforms.includes(platform)) {
      result.push({ id, name, platform, url: urls[index] });
      id += 1;
    }
    return result;
  }, [] as ISearchResult[]);
  const response: ISearchResponse = { query, results: formattedGames };
  return res.status(200).json(response);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return searchByQuery(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
