import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILocationType } from 'src/app/core/models/location-type';
import { CacheService } from 'src/app/core/services/cache.service';
import { LoggerService } from 'src/app/core/services/logger.service';
import { FilteringService } from '../../services/filtering.service';

@Component({
  selector: 'search-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss'],
})
export class FilterMenuComponent {
  open: boolean = false;

  constructor(
    private _logger: LoggerService,
    private _filteringService: FilteringService
  ) {}

  toggleMenu(): void {
    this.open = !this.open;
  }

  selectTypes(locationTypes: number[]) {
    this._filteringService.filterByTypes(locationTypes);
  }
}
