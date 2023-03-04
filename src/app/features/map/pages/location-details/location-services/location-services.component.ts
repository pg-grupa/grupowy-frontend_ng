import { Component } from '@angular/core';
import { slideInOutTrigger } from 'src/app/shared/animations/slide/slide-in-out-trigger';

@Component({
  selector: 'app-location-services',
  templateUrl: './location-services.component.html',
  styleUrls: ['./location-services.component.scss'],
  animations: [slideInOutTrigger()],
  host: {
    '[@slideInOut]': '',
  },
})
export class LocationServicesComponent {}
