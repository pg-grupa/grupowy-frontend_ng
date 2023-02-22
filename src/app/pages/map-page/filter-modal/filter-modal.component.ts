import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  selectedTypes: number[] = [];

  constructor(private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this._route.queryParamMap.subscribe((params) => {
      if (params.has('type')) {
        this.selectedTypes = params
          .getAll('type')
          .map((type) => parseInt(type));
      } else {
        this.selectedTypes = [];
      }
    });
  }

  onSelectTypes(types: number[]): void {
    this.selectedTypes = types;
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        type: types,
      },
      queryParamsHandling: 'merge',
    });
  }
}
