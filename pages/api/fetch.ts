import type { NextApiRequest, NextApiResponse } from "next";
import { Cheerio, CheerioAPI, load, Element } from "cheerio";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const SCRAPE_URL = process.env.NEXT_PUBLIC_SCRAPE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;
const HOST = process.env.NEXT_PUBLIC_HOST!;

const select = {
  list: "#content > div.row > div.col-xs > div.box.no-top-border",
  table: "table.zebra",
  tableRows: "tbody > tr",
  name: "tbody > tr > td:nth-child(2) > span",
  nameRow: "table[style='border-bottom: 1px solid #dfdfdf;']",
  trophyContent: "td:nth-child(2)",
  trophyType: "td:nth-child(6) > span > img",
  platform: "span.platform",
  thumbnail: "div.game-image-holder",
  cover: "div#first-banner > div.img",
};

const getContent = async (
  example: string | string[] | undefined,
  url: string,
  lang: string
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
      const payload = { url: url + "?lang=" + lang };
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
    const content = cheerio(row).find(select.trophyContent).first();
    const type = cheerio(row).find(select.trophyType).attr("title");
    const name = content.find("a").text().trim();
    const description = content.contents().last().text().trim();
    if (name.length !== 0 && description.length !== 0) {
      trophies.push({ name, description, type });
    }
  });
  return trophies;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url, lang = "ru", example } = req.query;

  if (!API_URL || !SCRAPE_URL || !API_KEY || !HOST) {
    return res.status(400).json({ message: "Unable to get env variables" });
  }

  if (typeof url !== "string" || !url) {
    return res.status(400).json({ message: "Invalid url format" });
  }

  if (typeof lang !== "string") {
    return res.status(400).json({ message: "Invalid lang format" });
  }

  const content = await getContent(example, url, lang);

  const cheerio = load(content.body);

  let title = cheerio("title").text();
  if (title.includes("PSNProfiles.com")) {
    title = title.replace("• PSNProfiles.com", "");
    title = title.replace("Trophies", "").trim();
  }

  const platforms = cheerio(select.platform);
  const platform = platforms.first().text().toUpperCase();

  const thumbnail = cheerio(select.thumbnail).find("img").attr("src");

  let cover = cheerio(select.cover).attr("style") || null;
  if (cover !== null) {
    cover = cover.replace(/.*\(|\).*/g, "");
  }

  const listsEl = cheerio(select.list);
  let lists: Object[] = [];

  listsEl.each((_, list) => {
    const haveDLC = listsEl.length > 1;
    const nameRow = cheerio(list).find(select.nameRow);
    const name = haveDLC
      ? cheerio(nameRow).find(select.name).text().trim()
      : "Base Game";
    const table = haveDLC ? nameRow.next() : listsEl.first().find(select.table);
    const rows = table.find(select.tableRows);
    const trophies = getTrophyList(cheerio, rows);
    const count = trophies.length;
    lists.push({ name, count, trophies });
  });

  return res.status(200).json({ title, platform, thumbnail, cover, lists });
};

export default handler;
