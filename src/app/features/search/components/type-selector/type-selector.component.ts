import { Component, EventEmitter, Output } from '@angular/core';
import { filter } from 'rxjs';
import { ILocationType } from 'src/app/core/models/location-type';
import { CacheService } from 'src/app/core/services/cache.service';
import { IFilterQuery } from '../../interfaces/filter-query';
import { FilteringService } from '../../services/filtering.service';

@Component({
  selector: 'search-type-selector',
  templateUrl: './type-selector.component.html',
  styleUrls: ['./type-selector.component.scss'],
})
export class TypeSelectorComponent {
  locationTypes = new Map<number, ILocationType>();

  @Output() selectedTypes: EventEmitter<number[]> = new EventEmitter<
    number[]
  >();

  constructor(
    private _filteringService: FilteringService,
    private _cacheService: CacheService
  ) {
    let cacheTypes = this._cacheService.getLocationTypes();
    cacheTypes.forEach((type) => {
      this.locationTypes.set(type.id, type);
    });
    this._filteringService.query$.subscribe((query) => {
      this._updateFromQuery(query);
    });
  }

  getSelectedTypes(): number[] {
    const selectedTypes: number[] = [];
    for (const locationType of this.locationTypes.values()) {
      if (locationType.selected) {
        selectedTypes.push(locationType.id);
      }
    }
    return selectedTypes;
  }

  toggleTypeSelection(id: number) {
    this.locationTypes.get(id)!.selected =
      !this.locationTypes.get(id)!.selected;
    this.selectedTypes.emit(this.getSelectedTypes());
  }

  resetSelection(emit: boolean = true) {
    for (const locationType of this.locationTypes.values()) {
      locationType.selected = false;
    }
    if (emit) {
      this.selectedTypes.emit([]);
    }
  }

  private _updateFromQuery(query: IFilterQuery) {
    this.resetSelection(false);

    let queryTypes: number[] = [];
    if (query.type && query.type.length > 0) {
      queryTypes = query.type;
    }
    queryTypes.forEach((queryType) => {
      this.locationTypes.get(queryType)!.selected = true;
    });
  }

  preserveOrder() {
    return 0;
  }
}
