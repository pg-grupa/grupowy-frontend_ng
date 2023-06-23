import { trigger, transition, query, animateChild } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPlaceService } from 'src/app/core/models/location-service';
import { fadeInOutTrigger } from 'src/app/shared/animations/fade/fade-in-out-trigger';
import { slideInOutTrigger } from 'src/app/shared/animations/slide/slide-in-out-trigger';

@Component({
  selector: 'app-location-services',
  templateUrl: './location-services.component.html',
  styleUrls: ['./location-services.component.scss'],
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
export class LocationServicesComponent {
  locationServices: IPlaceService[] = [];

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.locationServices = data['locationServices'];
    });
  }
}
