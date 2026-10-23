export type Format = "LP" | "CD";

export type Jacket = {
  bg: string;
  fg: string;
  accent: string;
  mark: string;
};

export type Track = {
  side: string;
  title: string;
};

export type Album = {
  id: string;
  artist: string;
  title: string;
  released: string;
  year: number;
  format: Format;
  label: string;
  catalog: string;
  genre: string;
  tracks: Track[];
  credits: string;
  blurb: string;
  jacket: Jacket;
};

export type Writer = {
  id: string;
  name: string;
  bio: string;
};

export type Note = {
  id: string;
  albumId: string;
  writerId: string;
  title: string;
  body: string;
  published: string;
  baseLikes: number;
  obi: boolean;
};

export type UserNote = {
  id: string;
  albumId: string;
  title: string;
  body: string;
  published: string;
  trialLikes: number;
};
