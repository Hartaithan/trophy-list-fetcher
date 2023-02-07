import { SEARCH_RESULTS } from "@/models/ExampleModel";
import { load } from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const SCRAPE_URL = process.env.NEXT_PUBLIC_SCRAPE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;
const HOST = process.env.NEXT_PUBLIC_HOST!;
const SEARCH_URL = "https://psnprofiles.com/search/games?q=";

interface ISearchQueries {
  [key: string]: string | string[];
  query: string;
  example: SEARCH_RESULTS;
}

interface ISearchResult {
  id: number;
  name: string;
  platforms: string[];
  url: string;
}

const getContent = async (query: string, example: SEARCH_RESULTS) => {
  let content = null;
  if (!!example) {
    let exampleUrl = "/example";
    if (!Object.values(SEARCH_RESULTS).includes(example)) {
      exampleUrl += "?search=true";
    } else {
      exampleUrl += `?search=${example}`;
    }
    const data = await fetch(API_URL + exampleUrl).then((res) => res.json());
    content = JSON.parse(data);
  } else {
    const payload = { url: SEARCH_URL + encodeURI(query) };
    content = await fetch(SCRAPE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": HOST,
      },
    }).then((res) => res.json());
  }
  return content;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, example } = req.query as ISearchQueries;

  if (!API_URL || !SCRAPE_URL || !API_KEY || !HOST) {
    return res.status(400).json({ message: "Unable to get env variables" });
  }

  const content = await getContent(query, example);

  const cheerio = load(content.body);

  let results: ISearchResult[] = [];

  return res.status(200).json({ query, results });
};

export default handler;
