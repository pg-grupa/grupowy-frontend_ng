import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'shared-hamburger',
  templateUrl: './hamburger-animated.component.html',
  styleUrls: ['./hamburger-animated.component.scss'],
})
export class HamburgerAnimatedComponent implements OnInit {
  @Input() size: string = '1em';
  @Input() toggled: boolean = false;
  @Input() color: string = '#000000';
  @Input() duration: string = '0.375s';

  @ViewChild('template', { static: true }) template!: any;

  hamburgerStyle?: { [key: string]: string };

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.hamburgerStyle = {
      width: this.size,
      height: this.size,
      fontSize: this.size,
      transitionDuration: this.duration,
    };
  }
}
