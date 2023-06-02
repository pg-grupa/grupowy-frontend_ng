import { trigger, transition, query, animateChild } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ILocationOpenhours,
  IOpenHours,
} from 'src/app/core/models/location-openhours';
import { fadeInOutTrigger } from 'src/app/shared/animations/fade/fade-in-out-trigger';

@Component({
  selector: 'app-location-openhours',
  templateUrl: './location-openhours.component.html',
  styleUrls: ['./location-openhours.component.scss'],
  animations: [
    fadeInOutTrigger('fadeInOut', {
      from: '0, 100%',
      to: '0, 100%',
      position: 'absolute',
    }),
    trigger('fadeInOutOuter', [
      transition(':enter', [query('@*', [animateChild()], { optional: true })]),
      transition(':leave', [query('@*', [animateChild()], { optional: true })]),
    ]),
  ],
  host: {
    '[@fadeInOutOuter]': '',
  },
})
export class LocationOpenhoursComponent {
  openHours!: ILocationOpenhours;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.openHours = data['location'].openHours;
    });
  }
}
