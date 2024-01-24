import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILocation } from 'src/app/core/models/location';
import { FormBaseComponent } from 'src/app/shared/components/forms/form-base.component';
import * as L from 'leaflet';
import { APIService } from 'src/app/core/services/api.service';

@Component({
  selector: 'filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss'],
})
export class FilterSidebarComponent extends FormBaseComponent {
  override form: FormGroup = this._fb.group({
    searchRadius: this._fb.control('', [Validators.required]),
  });

  selectedCoords: L.LatLng | null = null;
  selectedType: number | null = null;
  open: boolean = true;
  results: ILocation[] | null = null;

  @Output()
  searchResults: EventEmitter<ILocation[]> = new EventEmitter<ILocation[]>();

  constructor(private _fb: FormBuilder, private _apiService: APIService) {
    super();
  }

  toggle() {
    this.open = !this.open;
  }

  selectCoords(coords: L.LatLng) {
    this.selectedCoords = coords;
  }

  selectType(type: number | null) {
    this.selectedType = type;
  }

  performSearch() {
    let data: any = {
      searchRadius: this.form.value['searchRadius'] * 1000,
    };
    data['searchCenterLat'] = this.selectedCoords?.lat;
    data['searchCenterLng'] = this.selectedCoords?.lng;
    if (this.selectedType) {
      data['serviceType'] = this.selectedType;
    }

    this._apiService.getFilteredLocations(data).subscribe((locations) => {
      this.results = locations;
      this.searchResults.emit(this.results);
    });
  }

  calcDistance(location: ILocation) {
    let dist = this.selectedCoords!.distanceTo({
      lat: location.latitude,
      lng: location.longitude,
    });
    if (dist > 1000) {
      return (dist / 1000).toFixed(2) + ' km';
    } else {
      return dist.toFixed(0) + ' m';
    }
  }
}
