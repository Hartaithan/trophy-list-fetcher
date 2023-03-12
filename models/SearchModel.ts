export interface ISearchResult {
  id: number;
  name: string;
  platforms: string[];
  url: string;
}

export interface ISearchResponse {
  query: string;
  resultQuery: string | undefined;
  results: ISearchResult[];
}

export interface IPSNSearchResult {
  id: number;
  name: string;
  platform: string;
  url: string;
}

export interface IPSNSearchResponse {
  query: string;
  results: IPSNSearchResult[];
}
