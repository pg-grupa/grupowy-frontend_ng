import { ILocation } from '../models/location';

export enum MapCommandType {
  ClearMarkers,
  AddLocationsMarkers,
  FlyToLocation,
}

export interface IMapCommand {
  type: MapCommandType;
  payload?: any;
}

export class ClearMarkersCommand implements IMapCommand {
  type = MapCommandType.ClearMarkers;
}

export class AddLocationMarkersCommand implements IMapCommand {
  type = MapCommandType.AddLocationsMarkers;
  payload: ILocation[];

  constructor(locations: ILocation[]) {
    this.payload = locations;
  }
}

export class FlyToLocationCommand implements IMapCommand {
  type = MapCommandType.FlyToLocation;
  payload: ILocation;

  constructor(location: ILocation) {
    this.payload = location;
  }
}
