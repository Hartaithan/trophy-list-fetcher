import type { NextApiRequest, NextApiResponse } from "next";
import { Cheerio, CheerioAPI, load, Element } from "cheerio";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const SCRAPE_URL = process.env.NEXT_PUBLIC_SCRAPE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;
const HOST = process.env.NEXT_PUBLIC_HOST!;

const selectors = {
  list: "#content > div.row > div.col-xs > div.box.no-top-border",
  table: "table.zebra",
  tableRows: "tbody > tr",
  name: "tbody > tr > td:nth-child(2) > span",
  nameRow: "table[style='border-bottom: 1px solid #dfdfdf;']",
  trophyContent: "td:nth-child(2)",
  trophyType: "td:nth-child(6) > span > img",
};

const getContent = async (
  example: string | string[] | undefined,
  url: string
): Promise<any> => {
  let content = null;
  switch (!!example) {
    case true:
      let exampleUrl = "/example";
      if (example === "dlc") {
        exampleUrl = "/example?dlc=true";
      }
      const data = await fetch(API_URL + exampleUrl).then((res) => res.json());
      content = JSON.parse(data);
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
  return content;
};

const getTrophyList = (cheerio: CheerioAPI, rows: Cheerio<Element>) => {
  let trophies: Object[] = [];
  rows.each((_, row) => {
    const content = cheerio(row).find(selectors.trophyContent).first();
    const type = cheerio(row).find(selectors.trophyType).attr("title");
    const name = content.find("a").text().trim();
    const description = content.contents().last().text().trim();
    if (name.length !== 0 && description.length !== 0) {
      trophies.push({ name, description, type });
    }
  });
  return trophies;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url, example } = req.query;

  if (!API_URL || !SCRAPE_URL || !API_KEY || !HOST) {
    return res.status(400).json({ message: "Unable to get env variables" });
  }

  if (typeof url !== "string") {
    return res.status(400).json({ message: "Invalid url format" });
  }

  const content = await getContent(example, url);

  const cheerio = load(content.body);

  const title = cheerio("title").text();

  const listsEl = cheerio(selectors.list);
  let lists: Object[] = [];

  // NO DLC LISTS
  if (listsEl.length === 1) {
    const name = "Base Game";
    const table = listsEl.first().find(selectors.table);
    const rows = table.find(selectors.tableRows);
    const trophies = getTrophyList(cheerio, rows);
    const count = trophies.length;
    lists.push({ name, count, trophies });

    return res.status(200).json({ title, lists });
  }

  // HAVE DLC LISTS
  listsEl.each((_, list) => {
    const nameRow = cheerio(list).find(selectors.nameRow);
    const name = cheerio(nameRow).find(selectors.name).text().trim();
    const table = nameRow.next();
    const rows = table.find(selectors.tableRows);
    const trophies = getTrophyList(cheerio, rows);
    const count = trophies.length;
    lists.push({ name, count, trophies });
  });

  return res.status(200).json({ title, lists });
};

export default handler;
