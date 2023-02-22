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
