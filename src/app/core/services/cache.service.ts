import { Injectable } from '@angular/core';
import { ILocation } from '../models/location';
import { ILocationType } from '../models/location-type';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private _locationTypes: ILocationType[] = [];

  constructor() {}

  setLocationTypes(types: ILocationType[]) {
    this._locationTypes = types;
  }

  getLocationTypes(): ILocationType[] {
    return this._locationTypes;
  }

  getLocationType(id: number): ILocationType | undefined {
    return this._locationTypes.find((type) => type.id === id);
  }
}
