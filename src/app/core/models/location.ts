import { ILocationType } from './location-type';

export interface ILocation {
  id?: number;
  name: string;
  type: number | ILocationType;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  postal_code: string;
}
