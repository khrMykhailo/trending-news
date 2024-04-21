interface EntityBase {
  id: number;
  by: string;
  time: number;
  type: string;
}

export interface TradingNewsBase extends EntityBase {
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

export interface TradingNewsItemDTO extends TradingNewsBase {
  kids?: number[];
}

export interface TradingNewsItemInterface extends TradingNewsBase {
  comments: Comment[];
}
