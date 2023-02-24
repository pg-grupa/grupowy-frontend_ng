import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILocationType } from 'src/app/core/models/location-type';
import { CacheService } from 'src/app/core/services/cache.service';

@Component({
  selector: 'core-type-selector',
  templateUrl: './type-selector.component.html',
  styleUrls: ['./type-selector.component.scss'],
})
export class TypeSelectorComponent {
  locationTypes = new Map<number, ILocationType>();

  @Input()
  set selectedTypes(inputTypes: number[]) {
    this.resetSelection(false);
    inputTypes.forEach((inputType) => {
      this.locationTypes.get(inputType)!.selected = true;
    });
    this.getSelectedTypes();
  }

  @Output() selectedTypesChange: EventEmitter<number[]> = new EventEmitter<
    number[]
  >();

  allTypes: boolean = true;

  constructor(private _cacheService: CacheService) {
    let cacheTypes = this._cacheService.getLocationTypes();
    cacheTypes.forEach((type) => {
      this.locationTypes.set(type.id, type);
    });
  }

  getSelectedTypes(): number[] {
    const selectedTypes: number[] = [];
    for (const locationType of this.locationTypes.values()) {
      if (locationType.selected) {
        selectedTypes.push(locationType.id);
      }
    }
    if (selectedTypes.length > 0) {
      this.allTypes = false;
    } else {
      this.allTypes = true;
    }
    return selectedTypes;
  }

  toggleTypeSelection(id: number) {
    this.locationTypes.get(id)!.selected =
      !this.locationTypes.get(id)!.selected;
    this.selectedTypesChange.emit(this.getSelectedTypes());
  }

  resetSelection(emit: boolean = true) {
    for (const locationType of this.locationTypes.values()) {
      locationType.selected = false;
    }
    if (emit) {
      this.selectedTypesChange.emit([]);
    }
    this.getSelectedTypes(); // update allTypes flag
  }

  preserveOrder() {
    return 0;
  }
}
