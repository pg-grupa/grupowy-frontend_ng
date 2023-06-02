import { ILocationOpenhours, IOpenHours } from './location-openhours';
import { ILocationType } from './location-type';

export interface IFavouriteLocation {
  id: number;
  name: string;
  type: string;
}

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
  openHours: ILocationOpenhours;
  // rating_avg: null | number;
  // reviews_count: number;
}
