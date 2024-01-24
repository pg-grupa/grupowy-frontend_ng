import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILocationType } from 'src/app/core/models/location-type';
import { CacheService } from 'src/app/core/services/cache.service';

@Component({
  selector: 'core-single-type-selector',
  templateUrl: './single-type-selector.component.html',
  styleUrls: ['./single-type-selector.component.scss'],
})
export class SingleTypeSelectorComponent {
  locationTypes = new Map<number, ILocationType>();
  _selectedType: number | null = null;

  @Input()
  set selectedType(inputType: number) {
    this.resetSelection(false);
    this.locationTypes.get(inputType)!.selected = true;
    this.getSelectedType();
  }

  @Output() selectedTypeChange: EventEmitter<number | null> = new EventEmitter<
    number | null
  >();

  allTypes: boolean = true;

  constructor(private _cacheService: CacheService) {
    let cacheTypes = this._cacheService.getLocationTypes();
    cacheTypes.forEach((type) => {
      this.locationTypes.set(type.id, type);
    });
  }

  getSelectedType(): number | null {
    if (this._selectedType) {
      this.allTypes = false;
    } else {
      this.allTypes = true;
    }
    return this._selectedType;
  }

  toggleTypeSelection(id: number) {
    if (this._selectedType === id) {
      this._selectedType = null;
    } else {
      this._selectedType = id;
    }
    this.selectedTypeChange.emit(this.getSelectedType());
  }

  resetSelection(emit: boolean = true) {
    this._selectedType = null;
    if (emit) {
      this.selectedTypeChange.emit(null);
    }
    this.getSelectedType(); // update allTypes flag
  }

  preserveOrder() {
    return 0;
  }
}
