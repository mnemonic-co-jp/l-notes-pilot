export type Rank = {
  id: string;
  name: string;
  stamp: string;
  minLikes: number;
  perk: string;
};

export const RANKS: Rank[] = [
  {
    id: "audience",
    name: "聴衆",
    stamp: "聴",
    minLikes: 0,
    perk: "まだ署名がない。音盤を読み、誰かの稿を推すところから始まる。",
  },
  {
    id: "apprentice",
    name: "見習い筆者",
    stamp: "習",
    minLikes: 0,
    perk: "筆名が書誌に載る。ここが、この場所での最初の報酬。",
  },
  {
    id: "tsu",
    name: "通",
    stamp: "通",
    minLikes: 10,
    perk: "書き手一覧に朱の印が付く。品番を知っていることは、もう隠さなくてよい。",
  },
  {
    id: "knowing",
    name: "訳知り",
    stamp: "知",
    minLikes: 30,
    perk: "音盤ページで、稿が上のほうへ並ぶ。読まれた文章が、目録の前に出る。",
  },
  {
    id: "critic",
    name: "音楽評論家",
    stamp: "評",
    minLikes: 80,
    perk: "自分で肩書きを名乗れる。名乗った言葉は、著者ページに残る。",
  },
  {
    id: "selector",
    name: "選者",
    stamp: "選",
    minLikes: 200,
    perk: "選集の推薦枠に名が残る。ただし帯は、いいねでは買えない。",
  },
];

export const OBI_LINE = 800;
export const PUBLISH_MIN = 400;
export const TRIAL_STEP = 30;

export function rankFor(likes: number, noteCount: number): Rank {
  if (noteCount <= 0) return RANKS[0];
  let current = RANKS[1];
  for (const rank of RANKS.slice(1)) {
    if (likes >= rank.minLikes) current = rank;
  }
  return current;
}

export function nextRank(likes: number, noteCount: number): Rank | null {
  const current = rankFor(likes, noteCount);
  const index = RANKS.findIndex((rank) => rank.id === current.id);
  return RANKS[index + 1] ?? null;
}

export function rankWeight(likes: number, noteCount: number): number {
  return RANKS.findIndex((rank) => rank.id === rankFor(likes, noteCount).id);
}
