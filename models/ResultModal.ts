export interface ITrophy {
  name: string;
  description: string;
  type: string;
}

export interface IList {
  name: string;
  count: number;
  trophies: ITrophy[];
}

export interface IResult {
  title: string;
  lists: IList[];
  platform: string;
  thumbnail: string;
  cover: string | null;
  message: string | null;
}

export interface IRow {
  id: number;
  value: string;
  label: string;
}
