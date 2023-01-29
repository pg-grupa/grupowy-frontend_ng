import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'core-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  loading: boolean = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadingService.loading$.subscribe(
        (loading) => (this.loading = loading)
      );
    });
  }
}
