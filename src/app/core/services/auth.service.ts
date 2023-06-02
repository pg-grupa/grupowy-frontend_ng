import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, finalize, map, Observable, of } from 'rxjs';
import { IUser } from '../models/user';
import { APIService } from './api.service';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';

/**
 * Service for authenticating user, retrieving and updating user's profile
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** API urls iused by this service */
  private _apiUrls = {
    login: 'token/',
    // logout: 'accounts/logout/',
    register: 'register/',
    // update: 'accounts/update/',
    // whoami: 'accounts/whoami/',
  };

  /** Subject for storing authenticated user */
  private _userSubject: BehaviorSubject<IUser | null>;

  /** Currently authenticated user as Observable */
  public readonly user$: Observable<IUser | null>;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _route: ActivatedRoute,
    private _notificationsService: NotificationService,
    private _logger: LoggerService
  ) {
    // Check if user is authenticated and load user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      this._logger.debug('AuthService', 'Loaded user from localStorage', user);
    }
    this._userSubject = new BehaviorSubject<IUser | null>(user);
    this.user$ = this._userSubject.asObservable();

    // Listen to localStorage changes by other tabs/windows,
    // update user data if localStorage['user'] changed.
    window.addEventListener(
      'storage',
      (event) => {
        if (event.key === 'user') {
          this._logger.debug(
            'AuthService',
            'Loading session from another browser tab.'
          );
          this._loadSession();
        }
      },
      false
    );
  }

  /** Returns currently logged in user, null if not authenticated. */
  public getUser(): IUser | null {
    return this._userSubject.value;
  }

  /** Returns true if the user is authenticated */
  public get isAuthenticated(): boolean {
    return this.getUser() ? true : false;
  }

  public get isAuthenticated$(): Observable<boolean> {
    return this._userSubject
      .asObservable()
      .pipe(map((user) => (user ? true : false)));
  }

  /**
   * Log user in with provided credentials.
   */
  public postLogin(data: {
    email: string;
    password: string;
  }): Observable<IUser> {
    return this._http.post<any>(this._apiUrls.login, data).pipe(
      map((response) => {
        const user = response.data;
        this._logger.debug('AuthService', 'Authenticated as:', user);
        return this._startSession(user);
      })
    );
  }

  /**
   * Register user with provided credentials.
   */
  public postRegister(params: { [key: string]: string }): Observable<void> {
    return this._http.post<void>(this._apiUrls.register, params);
  }

  /**
   * Send request to log user out, on successful response delete user data from storage.
   */
  public getLogout(redirectHome: boolean = false) {
    // return this._http.get(this._apiUrls.logout).pipe(
    //   map(() => {
    //     this._stopSession(redirectHome);
    //   }),
    // );
    return of(this._stopSession(redirectHome));
  }

  /**
   * Update user's profile, on successful response update user's data in storage.
   */
  // public postUpdateProfile(params: {
  //   [key: string]: string;
  // }): Observable<IUser> {
  //   return this._http.post<IUser>(this._apiUrls.update, params).pipe(
  //     map((user) => {
  //       return this._startSession(user);
  //     })
  //   );
  // }

  // public getWhoAmI() {
  //   return this._http.get<IUser>(this._apiUrls.whoami);
  // }

  /** Update user's data in localStorage. */
  private _startSession(user: IUser): IUser {
    localStorage.setItem('user', JSON.stringify(user));
    this._userSubject.next(user);
    return user;
  }

  /** Load user's data from localStorage. */
  private _loadSession(): IUser | null {
    let user = JSON.parse(localStorage.getItem('user') || 'null');
    this._userSubject.next(user);
    return user;
  }

  /** Remove user's data from localStorage and show notification. Redirects to home page. */
  private _stopSession(redirectHome: boolean) {
    localStorage.removeItem('user');
    this._userSubject.next(null);
    // this._notificationsService.success('Successfully logged out');
    if (redirectHome) {
      this._router.navigate(['/']);
    }
  }
}
