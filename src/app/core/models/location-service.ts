export type PriceType = 'MONTHLY' | 'PER_HOUR' | 'ONCE';

export interface IPlaceService {
  id: number;
  name: string;
  price: number;
  priceType: PriceType;
}
