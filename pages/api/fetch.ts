import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SCRAPE_URL = process.env.NEXT_PUBLIC_SCRAPE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const HOST = process.env.NEXT_PUBLIC_HOST;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url, example } = req.query;

  let content = null;

  if (!API_URL || !SCRAPE_URL || !API_KEY || !HOST) {
    return res.status(400).json({ message: "Unable to get env variables" });
  }

  if (typeof url !== "string") {
    return res.status(400).json({ message: "Invalid url format" });
  }

  switch (!!example) {
    case true:
      const example = await fetch(API_URL + "/example").then((res) =>
        res.json()
      );
      content = JSON.parse(example);
      break;
    default:
      const payload = { url };
      content = await fetch(SCRAPE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": HOST,
        },
      }).then((res) => res.json());
      break;
  }

  const cheerio = load(content.body);
  const title = cheerio("title").text();

  return res.status(200).json({ title });
};

export default handler;
