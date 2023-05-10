import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { IReview } from 'src/app/core/models/review';

@Component({
  selector: 'map-location-review[review]',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements AfterViewInit {
  @ViewChild('reviewText') reviewText!: ElementRef;
  @Input() review!: IReview;
  collapsed = true;
  overflow?: boolean = false;

  ngAfterViewInit() {
    setTimeout(() => {
      const element = this.reviewText.nativeElement;
      this.overflow = element.scrollHeight > element.clientHeight;
    });
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
}
