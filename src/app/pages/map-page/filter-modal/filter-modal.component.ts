import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MapPageService } from '../map-page.service';

@Component({
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  // selectedTypes: number[] = [];
  selectedTypes$!: Observable<number[]>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapPageService: MapPageService
  ) {}

  ngOnInit(): void {
    this.selectedTypes$ = this._mapPageService.selectedTypes$;
  }

  onSelectTypes(types: number[]): void {
    this._mapPageService.selectTypes(types);
  }
}
