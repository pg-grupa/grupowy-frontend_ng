import { Component } from '@angular/core';
import { slideInOutTrigger } from 'src/app/shared/animations/slide/slide-in-out-trigger';

@Component({
  selector: 'app-location-events',
  templateUrl: './location-events.component.html',
  styleUrls: ['./location-events.component.scss'],
  animations: [slideInOutTrigger],
  host: {
    '[@slideInOut]': '',
  },
})
export class LocationEventsComponent {}
