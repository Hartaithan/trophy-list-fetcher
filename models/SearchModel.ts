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
