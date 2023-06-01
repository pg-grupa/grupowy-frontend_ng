import { ILocationType } from './location-type';

export interface ILocation {
  id?: number;
  name: string;
  place_type_id: number;
  latitude: number;
  longitude: number;
  address: string;
}

export interface ILocationFull extends Omit<ILocation, 'type'> {
  id: number;
  type: ILocationType;
  address: string;
  phone: string;
  owner: string;
  favourited: boolean;
  // rating_avg: null | number;
  // reviews_count: number;
}
