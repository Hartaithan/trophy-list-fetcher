import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore
import puppeteer from "puppeteer-core";
import { load } from "cheerio";
import chrome from "chrome-aws-lambda";

type Data = {
  title: string;
};

const local = {
  args: [],
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
};

const getBrowser = async () => {
  const options = {
    production: {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    },
    development: local,
    test: local,
  };
  const browser = await puppeteer.launch(options[process.env.NODE_ENV]);
  return browser;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { url } = req.query;

  const browser = await getBrowser();

  const page = await browser.newPage();
  page.setUserAgent(
    "Opera/9.80 (J2ME/MIDP; Opera Mini/5.1.21214/28.2725; U; ru) Presto/2.8.119 Version/11.10"
  );

  if (!url) {
    return res.status(400).json({ title: "url not found" });
  }

  await page.goto(url as string);

  const content = await page.content();
  const cheerio = load(content);

  const title = cheerio("title").text();

  return res.status(200).json({ title });
};

export default handler;
