export type IconProps = {
  size?: number;
  className?: string;
};

export interface ICardCategory {
  id: number;
  name: string;
}

export interface IUpgrade {
  level: number;
  profit_per_hour: 2208;
  upgrade_price: 11064;
}
export interface ICard {
  category: ICardCategory;
  icon_url: string;
  id: number;
  level: number;
  name: string;
  upgrade: IUpgrade;
}
