import { Component } from '@angular/core';
import { StarType } from '../../star-rating/star-rating.component';
import { AbstractInputComponent } from '../abstract-input.component';

@Component({
  selector: 'rating-input',
  templateUrl: './rating-input.component.html',
  styleUrls: ['./rating-input.component.scss'],
})
export class RatingInputComponent extends AbstractInputComponent {
  stars = new Array<StarType>(5).fill(StarType.Empty);

  override set value(value: number) {
    if (value === null || value < 1) {
      this._value = 0;
    } else {
      this._value = value > 5 ? 5 : value;
    }

    this.setStars();
    this.onChange(this._value);
  }

  setStars() {
    const stars = new Array(5).fill(StarType.Empty);
    let i = 0;
    for (i = 0; i < this._value; i++) {
      stars[i] = StarType.Full;
    }
    this.stars = stars;
  }

  starSelected(index: number) {
    if (!this.disabled) this.value = index + 1;
  }
}
