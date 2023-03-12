import { NextApiRequest, NextApiResponse } from "next";

const SEARCH_URL = process.env.NEXT_PUBLIC_SEARCH_URL!;

interface IFetchQueries {
  [key: string]: string | string[];
  url: string;
}

const search_tag = "NPWR";

const getContent = async (url: string): Promise<string | null> => {
  let content: string | null = null;
  try {
    const fetchUrl = `${SEARCH_URL}${url}/trophies#args:ajax=1`;
    content = await fetch(fetchUrl).then((r) => r.text());
  } catch (error) {
    console.error("get content error", error);
  }
  return content;
};

const getCode = (content: string): string =>
  content.substr(content.indexOf(search_tag), 8 + search_tag.length);

const getTrophyList = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query as IFetchQueries;
  const content = await getContent(url);
  let code: string | null = null;
  if (!content) {
    return res.status(400).json({ message: "Unable to get content" });
  }
  code = getCode(content);
  if (code.length !== 12) {
    return res.status(400).json({ message: "Invalid trophy list code" });
  }
  const response = { url, code };
  return res.status(200).json(response);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return getTrophyList(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
