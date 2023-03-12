export interface ISearchResult {
  id: number;
  name: string;
  platform?: string;
  platforms?: string[];
  url: string;
}

export interface IPSNProfilesSearchResponse {
  query: string;
  resultQuery: string | undefined;
  results: ISearchResult[];
}

export interface IPSNSearchResponse {
  query: string;
  results: ISearchResult[];
}
