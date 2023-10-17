import {
  IPSNFetchResponse as IResponse,
  IPSNTrophyList as ITrophyList,
  IPSNTrophy as ITrophy,
} from "@/models/TrophyModel";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import {
  AllCallOptions,
  AuthorizationPayload,
  getTitleTrophies,
  getTitleTrophyGroups,
  TitleTrophyGroupsResponse,
  TitleTrophiesResponse,
} from "psn-api";
import { TrophyGroup } from "psn-api/dist/models/trophy-group.model";

const SEARCH_URL = process.env.NEXT_PUBLIC_SEARCH_URL!;

type TitleTrophiesOptions = Pick<
  AllCallOptions,
  "headerOverrides" | "limit" | "npServiceName" | "offset"
>;

interface IFetchQueries {
  [key: string]: string | string[];
  url: string;
  lang: string;
}

interface ITitleTrophies extends TitleTrophiesResponse {
  error?: Error;
}

interface ITitleGroups extends TitleTrophyGroupsResponse {
  error?: Error;
}

const searchTag = "NPWR";

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
  content.substr(content.indexOf(searchTag), 8 + searchTag.length);

const getPlatformFromUrl = (url: string): string | null => {
  let platform: string | null = null;
  const splitted = url.split("/");
  if (splitted.length > 0) {
    platform = splitted[1];
  }
  return platform;
};

const formatTrophies = (
  group: TrophyGroup,
  list: ITitleTrophies
): ITrophy[] => {
  const trophies: ITrophy[] = [];
  for (let i = 0; i < list.trophies.length; i += 1) {
    const { trophyId, trophyName, trophyDetail, trophyGroupId, trophyType } =
      list.trophies[i];
    const id = trophyId || -1;
    const name = trophyName || "Trophy name not found";
    const description = trophyDetail || "Trophy description not found";
    const type = trophyType.charAt(0).toUpperCase() + trophyType.slice(1);
    const sameGroup = trophyGroupId === group.trophyGroupId;
    const isPlatinum = trophyType === "platinum";
    if (sameGroup && !isPlatinum) {
      trophies.push({ id, name, description, type });
    }
  }
  return trophies;
};

const formatTrophyLists = (
  groups: ITitleGroups,
  list: ITitleTrophies
): ITrophyList[] => {
  const lists: ITrophyList[] = [];
  for (let i = 0; i < groups.trophyGroups.length; i += 1) {
    const group = groups.trophyGroups[i];
    const { trophyGroupName, trophyGroupId } = group;
    const isBase = trophyGroupId === "default";
    const trophies = formatTrophies(group, list);
    lists.push({
      name: isBase ? "Base Game" : trophyGroupName,
      count: trophies.length,
      trophies,
    });
  }
  return lists;
};

const getTrophyList = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url, lang = "en-en" } = req.query as IFetchQueries;

  const platform = getPlatformFromUrl(url);

  const content = await getContent(url);

  if (!content) {
    return res.status(400).json({ message: "Unable to get content" });
  }

  let code: string | null = null;
  code = getCode(content);

  if (code.length !== 12) {
    return res.status(400).json({ message: "Invalid trophy list code" });
  }

  const options = { req, res };
  const access_token = getCookie("access_token", options) as string;
  const authorization: AuthorizationPayload = { accessToken: access_token };

  let listOptions: Partial<TitleTrophiesOptions> = {
    headerOverrides: { "Accept-Language": lang },
  };

  if (platform !== "ps5") {
    listOptions = { ...listOptions, npServiceName: "trophy" };
  }

  const [groups, trophies]: [ITitleGroups, ITitleTrophies] = await Promise.all([
    getTitleTrophyGroups(authorization, code, listOptions),
    getTitleTrophies(authorization, code, "all", listOptions),
  ]);
  if (groups.error) {
    return res.status(400).json({
      message: groups.error.message || "Unable to get trophy groups",
    });
  }
  if (trophies.error) {
    return res.status(400).json({
      message: trophies.error.message || "Unable to get trophy lists",
    });
  }

  const lists: ITrophyList[] = formatTrophyLists(groups, trophies);

  const response: IResponse = {
    title: groups.trophyTitleName,
    platform: groups.trophyTitlePlatform,
    thumbnail: groups.trophyTitleIconUrl,
    lists,
  };
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
