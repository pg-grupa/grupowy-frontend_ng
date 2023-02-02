import { Component } from '@angular/core';
import { FilteringService } from 'src/app/core/services/filtering.service';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [FilteringService],
})
export class OverviewComponent {
  constructor(
    private _logger: LoggerService,
    private _filteringService: FilteringService
  ) {}
}
