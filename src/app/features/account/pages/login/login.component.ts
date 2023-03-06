import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup = this._fb.group({
    username: this._fb.control('', [Validators.required]),
    password: this._fb.control('', [Validators.required]),
  });

  public get fc() {
    return this.form.controls;
  }

  constructor(
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _notifications: NotificationsService
  ) {}

  onSubmit() {
    // TODO: Show errors in template
    this._authService.postLogin(this.form.value).subscribe((response) => {
      this._notifications.success(`Welcome, ${response.username}!`);

      // on successful login, go to returnUrl if present, otherwise close login modal
      if (this._route.snapshot.queryParamMap.has('returnUrl')) {
        this._router.navigateByUrl(
          this._route.snapshot.queryParamMap.get('returnUrl')!
        );
      } else {
        this._router.navigate([{ outlets: { auth: null } }], {
          queryParamsHandling: 'preserve',
        });
      }
    });
  }
}
