import { ILocationType } from './location-type';

export interface ILocation {
  id?: number;
  name: string;
  type: number;
  latitude: number;
  longitude: number;
}

export interface ILocationFull extends Omit<ILocation, 'type'> {
  id: number;
  type: ILocationType;
  address: string;
  city: string;
  postal_code: string;
  favourited: boolean;
}
