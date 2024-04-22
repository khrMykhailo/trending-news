interface EntityBase {
  id: number;
  by: string;
  time: number;
  type: string;
}

export interface TrendingNewsBase extends EntityBase {
  descendants: number;
  score: number;
  title: string;
  url: string;
}

export interface Comment extends EntityBase {
  parent: number;
  text: string;
  kids?: number[];
  comments?: Comment[];
}

export interface TrendingNewsItemDTO extends TrendingNewsBase {
  kids?: number[];
}

export interface TrendingNewsItemInterface extends TrendingNewsBase {
  comments: Comment[];
}
