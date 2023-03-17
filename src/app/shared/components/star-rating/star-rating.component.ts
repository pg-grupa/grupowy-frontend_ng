import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

export enum StarType {
  Full = 'fa-solid fa-star',
  Half = 'fa-regular fa-star-half-stroke',
  Empty = 'fa-regular fa-star',
}

@Component({
  selector: 'shared-rating[value]',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StarRatingComponent {
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
    for (i = 0; i < Math.floor(this._value); i++) {
      stars[i] = StarType.Full;
    }

    let decimal = this._value % 1;
    if (decimal > 0.75) {
      stars[i] = StarType.Full;
    } else if (decimal > 0.25) {
      stars[i] = StarType.Half;
    }
    this.stars = stars;
  }
}
