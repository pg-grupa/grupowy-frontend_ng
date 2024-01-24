import { Component, OnInit } from '@angular/core';
import * as GeoSearch from 'leaflet-geosearch';
import { RawResult } from 'leaflet-geosearch/dist/providers/openStreetMapProvider';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import { from, map } from 'rxjs';

@Component({
  selector: 'map-search-sidebar',
  templateUrl: './search-sidebar.component.html',
  styleUrls: ['./search-sidebar.component.scss'],
})
export class SearchSidebarComponent implements OnInit {
  open: boolean = false;
  query: string = '';
  timeout: any | undefined;
  provider!: GeoSearch.OpenStreetMapProvider;
  results: SearchResult[] = [];

  toggle() {
    this.open = !this.open;
  }

  ngOnInit(): void {
    this.provider = new GeoSearch.OpenStreetMapProvider({
      params: {
        'accept-language': 'pl', // render results in Polish
        countrycodes: 'pl', // limit search results to the Poland
      },
    });
  }

  onQueryChanged() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.performSearch(), 1000);
  }

  performSearch() {
    from(this.provider.search({ query: this.query })).subscribe((results) => {
      this.results = results;
    });
  }
}
