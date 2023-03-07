import * as L from 'leaflet';

export namespace Coords {
  export function parse(coords: string): L.LatLng | undefined {
    const [strLat, strLng] = coords.split(',');
    const lat = +strLat;
    const lng = +strLng;
    // TODO: check if values are valid
    return L.latLng(lat, lng);
  }

  export function stringify(center: L.LatLng): string {
    return `${center.lat},${center.lng}`;
  }
}

export class PrettyLatLng extends L.LatLng {
  constructor(lat: number, lng: number) {
    super(lat, lng);
  }

  static fromLatLng(latLng: L.LatLng): PrettyLatLng {
    return new PrettyLatLng(latLng.lat, latLng.lng);
  }

  static parse(coords: string): PrettyLatLng | undefined {
    const [strLat, strLng] = coords.split(',');
    const lat = +strLat;
    const lng = +strLng;
    if (isNaN(lat) || isNaN(lng)) {
      return undefined;
    }
    return new PrettyLatLng(lat, lng);
  }

  stringify(): string {
    return `${this.lat},${this.lng}`;
  }

  get pretty(): string {
    return `${this.prettyLat}, ${this.prettyLng}`;
  }

  get prettyLat(): string {
    const absLat = Math.abs(this.lat);
    const deg = Math.floor(absLat);
    const min = ((absLat % 1) * 100).toFixed(4);
    return `${deg}° ${min}' ${this.latSymbol}`;
  }

  get prettyLng(): string {
    const absLng = Math.abs(this.lng);
    const deg = Math.floor(absLng);
    const min = ((absLng % 1) * 100).toFixed(4);
    return `${deg}° ${min}' ${this.lngSymbol}`;
  }

  get latSymbol(): string {
    return this.lat > 0 ? 'N' : 'S';
  }

  get lngSymbol(): string {
    return this.lng > 0 ? 'E' : 'W';
  }
}
