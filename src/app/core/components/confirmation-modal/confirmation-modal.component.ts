import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { fadeInOutTrigger } from 'src/app/shared/animations/fade/fade-in-out-trigger';
import {
  ConfirmationService,
  Question,
} from '../../services/confirmation.service';

@Component({
  selector: 'core-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  animations: [fadeInOutTrigger({ from: '0, 100%' })],
})
export class ConfirmationModalComponent implements OnDestroy {
  question?: Question;
  hidden: boolean = true;

  private _questionSubscription: Subscription;

  constructor(private _confirmationService: ConfirmationService) {
    this._questionSubscription = this._confirmationService.question$.subscribe(
      (question) => {
        this.question = question;
        this.hidden = false;
      }
    );
  }

  ngOnDestroy(): void {
    this._questionSubscription.unsubscribe();
  }

  sendAnswer(value: any) {
    this._confirmationService.answer(value);
    this.hidden = true;
  }
}
