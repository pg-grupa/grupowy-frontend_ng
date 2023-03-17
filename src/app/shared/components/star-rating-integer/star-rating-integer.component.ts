import { Component, Input } from '@angular/core';
import { StarType } from '../star-rating/star-rating.component';

@Component({
  selector: 'shared-rating-integer',
  templateUrl: './star-rating-integer.component.html',
  styleUrls: ['./star-rating-integer.component.scss'],
})
export class StarRatingIntegerComponent {
  private _value!: number;

  stars = new Array<StarType>(5).fill(StarType.Empty);

  @Input() set value(value: number | null) {
    if (value === null || value < 1) {
      this._value = 0;
    } else {
      this._value = value > 5 ? 5 : value;
    }

    this.setStars();
  }

  setStars() {
    const stars = new Array(5).fill(StarType.Empty);
    let i = 0;
    for (i = 0; i < this._value; i++) {
      stars[i] = StarType.Full;
    }
    this.stars = stars;
  }
}
