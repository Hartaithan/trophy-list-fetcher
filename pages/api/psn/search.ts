import {
  IPSNSearchResponse as ISearchResponse,
  ISearchResult,
} from "@/models/SearchModel";
import { NextApiRequest, NextApiResponse } from "next";

const SEARCH_URL = process.env.NEXT_PUBLIC_APP_SEARCH_URL!;

interface ISearchQueries {
  [key: string]: string | string[];
  query: string;
}

interface ISearchRes {
  id: string;
  title: string;
  platform_title: string;
  count_tlist: number;
  count_article: number;
  release_date: string;
}

const allowedPlatforms: string[] = ["PS5", "PS4", "PS3", "Vita"];

const searchByQuery = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.query as ISearchQueries;
  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }
  let results = null;
  try {
    results = await fetch(`${SEARCH_URL}/games/search?search=${query}`).then(
      (r) => r.json()
    );
  } catch (error) {
    console.error("search error", error);
    return res
      .status(400)
      .json({ message: `Unable to search by query: ${query}` });
  }
  const games: ISearchRes[] = results?.games || [];
  let counted_id = 1;
  const formattedGames = games.reduce((result, item) => {
    const { id, title, platform_title, count_tlist } = item;
    if (allowedPlatforms.includes(platform_title) && count_tlist > 0) {
      result.push({
        id: counted_id,
        name: title,
        platform: platform_title,
        url: `${platform_title.toLowerCase()}/${id}`,
      });
      counted_id += 1;
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
