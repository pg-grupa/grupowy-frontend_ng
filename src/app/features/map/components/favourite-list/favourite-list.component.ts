import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IFavouriteLocation } from 'src/app/core/models/location';
import { AuthService } from 'src/app/core/services/auth.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { fadeInOutTrigger } from 'src/app/shared/animations/fade/fade-in-out-trigger';

@Component({
  selector: 'map-favourite-list',
  templateUrl: './favourite-list.component.html',
  styleUrls: ['./favourite-list.component.scss'],
})
export class FavouriteListComponent {
  isAuthenticated: boolean = false;
  open: boolean = false;
  favouriteLocations: IFavouriteLocation[] = [];

  constructor(
    private _authService: AuthService,
    private _cacheService: CacheService
  ) {}

  ngOnInit() {
    this._authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
    // this.toggle();
  }

  toggle() {
    this.open = !this.open;

    if (this.open) {
      let favouriteLocations: IFavouriteLocation[] = [];
      this._cacheService.favouriteLocations.forEach((location) => {
        favouriteLocations.push(location);
      });
      this.favouriteLocations = favouriteLocations;
    }
  }
}
