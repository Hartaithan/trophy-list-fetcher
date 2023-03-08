import { SEARCH_RESULTS } from "@/models/ExampleModel";
import { ISearchResult } from "@/models/SearchModel";
import { load } from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const SCRAPE_URL = process.env.NEXT_PUBLIC_SCRAPE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;
const HOST = process.env.NEXT_PUBLIC_HOST!;
const BASE_URL = "https://psnprofiles.com";
const SEARCH_URL = "/search/games?q=";

const select = {
  query: "h3#breadCrumbs",
  resultRows: "table.zebra > tbody > tr",
  resultName: "td:nth-child(2) > a",
  platforms: "td:nth-child(2) > div.platforms > span.platform",
};

interface ISearchQueries {
  [key: string]: string | string[];
  query: string;
  example: SEARCH_RESULTS;
}

const getContent = async (query: string, example: SEARCH_RESULTS) => {
  let content = null;
  if (example) {
    let exampleUrl = "/psnprofiles/example";
    if (!Object.values(SEARCH_RESULTS).includes(example)) {
      exampleUrl += "?search=true";
    } else {
      exampleUrl += `?search=${example}`;
    }
    const data = await fetch(API_URL + exampleUrl).then((res) => res.json());
    content = JSON.parse(data);
  } else {
    const payload = { url: BASE_URL + SEARCH_URL + encodeURI(query) };
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

  const results: ISearchResult[] = [];

  const resultQuery = cheerio(select.query).text().split("›").pop();

  const resultRows = cheerio(select.resultRows);

  resultRows.each((index, result) => {
    const nameElement = cheerio(result).find(select.resultName);
    const name = nameElement.text().trim();
    const url = BASE_URL + nameElement.attr("href");

    const platforms: string[] = [];
    const platformsTags = cheerio(result).find(select.platforms);
    platformsTags.each((_, platform) => {
      const value = cheerio(platform).text();
      if (value) {
        platforms.push(value);
      }
    });
    results.push({ id: index + 1, name, url, platforms });
  });

  return res.status(200).json({ query, resultQuery, results });
};

export default handler;
