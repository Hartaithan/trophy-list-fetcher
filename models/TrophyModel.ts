export interface IPSNProfilesTrophy {
  name: string;
  description: string;
  type: string;
}

export interface IPSNProfilesTrophyList {
  name: string;
  count: number;
  trophies: IPSNProfilesTrophy[];
}

export interface IPSNProfilesFetchResponse {
  title: string;
  platform: string;
  thumbnail: string;
  cover: string;
  lists: IPSNProfilesTrophyList[];
  message?: string;
}

export interface IPSNProfilesTableRow {
  id: number;
  value: string;
  label: string;
}

export interface IPSNTrophy {
  name: string;
  description: string;
  type: string;
}

export interface IPSNTrophyList {
  name: string;
  count: number;
  trophies: IPSNProfilesTrophy[];
}

export interface IPSNFetchResponse {
  title: string;
  platform: string;
  thumbnail: string;
  lists: IPSNTrophyList[];
  message?: string;
}
