import { Component } from '@angular/core';
import { fadeInOutTrigger } from 'src/app/shared/animations/fade/fade-in-out-trigger';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: [
    fadeInOutTrigger('fadeInOut', { from: '0, 100%', to: '0, 100%' }),
  ],
})
export class AccountComponent {}
