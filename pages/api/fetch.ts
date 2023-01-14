import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-extra";
import { load } from "cheerio";
import chrome from "chrome-aws-lambda";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import "puppeteer-extra-plugin-stealth/evasions/chrome.app";
import "puppeteer-extra-plugin-stealth/evasions/chrome.csi";
import "puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes";
import "puppeteer-extra-plugin-stealth/evasions/chrome.runtime";
import "puppeteer-extra-plugin-stealth/evasions/defaultArgs";
import "puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow";
import "puppeteer-extra-plugin-stealth/evasions/media.codecs";
import "puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency";
import "puppeteer-extra-plugin-stealth/evasions/navigator.languages";
import "puppeteer-extra-plugin-stealth/evasions/navigator.permissions";
import "puppeteer-extra-plugin-stealth/evasions/navigator.plugins";
import "puppeteer-extra-plugin-stealth/evasions/navigator.vendor";
import "puppeteer-extra-plugin-stealth/evasions/navigator.webdriver";
import "puppeteer-extra-plugin-stealth/evasions/sourceurl";
import "puppeteer-extra-plugin-stealth/evasions/user-agent-override";
import "puppeteer-extra-plugin-stealth/evasions/webgl.vendor";
import "puppeteer-extra-plugin-stealth/evasions/window.outerdimensions";

type Data = {
  title: string;
};

puppeteer.use(StealthPlugin());

const local = {
  args: [],
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: false,
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

  await page.goto(url);
  await page.waitForTimeout(5000);

  const content = await page.content();
  const cheerio = load(content);

  const title = cheerio("title").text();

  await browser.close();

  res.status(200).json({ title });
};

export default handler;
