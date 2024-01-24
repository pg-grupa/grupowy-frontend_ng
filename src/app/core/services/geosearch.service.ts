import { Injectable } from '@angular/core';
import * as GeoSearch from 'leaflet-geosearch';
import * as L from 'leaflet';
import { from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeosearchService {
  provider: GeoSearch.OpenStreetMapProvider;

  constructor() {
    this.provider = new GeoSearch.OpenStreetMapProvider({
      params: { addressdetails: 1 },
    });
  }

  searchCoordinates(coords: L.LatLng) {
    return from(
      this.provider.search({ query: coords.lat + ',' + coords.lng })
    ).pipe(
      map((results) => {
        if (results.length > 0) {
          return results[0].raw;
        }
        return null;
      })
    );
  }

  searchQuery(query: string) {
    console.log(query);
    return from(this.provider.search({ query: query }));
  }
}
