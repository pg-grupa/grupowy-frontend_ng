import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { FilteringService } from './services/filtering.service';

@Component({
  selector: 'search-module',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [FilteringService],
})
export class SearchComponent {
  constructor(private _filteringService: FilteringService) {}
}
