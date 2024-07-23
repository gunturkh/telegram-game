export type IconProps = {
  size?: number;
  className?: string;
};

export interface ICardCategory {
  id: number;
  name: string;
}

export interface ICardUpgrade {
  level: number;
  profit_per_hour: number;
  upgrade_price: number;
}

export interface ICardCurrent {
  level: number;
  profit_per_hour: number;
}
export interface ICard {
  category: ICardCategory;
  icon_url: string;
  id: number;
  level: number;
  name: string;
  current: ICardCurrent;
  upgrade: ICardUpgrade;
}
