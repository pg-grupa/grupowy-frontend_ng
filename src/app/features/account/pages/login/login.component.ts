import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FormBaseComponent } from 'src/app/shared/components/forms/form-base.component';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends FormBaseComponent {
  override form: FormGroup = this._fb.group({
    email: this._fb.control('', [Validators.required, Validators.email]),
    password: this._fb.control('', [Validators.required]),
  });

  constructor(
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _notifications: NotificationService
  ) {
    super();
  }

  login() {
    this._authService
      .postLogin(this.form.value)
      .pipe(this.onSubmit)
      .subscribe((response) => {
        this._notifications.success(`Welcome!`);
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
