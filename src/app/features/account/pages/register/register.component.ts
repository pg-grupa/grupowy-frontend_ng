import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FormBaseComponent } from 'src/app/shared/components/forms/form-base.component';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends FormBaseComponent {
  override form: FormGroup = this._fb.group({
    first_name: this._fb.control('', [Validators.required]),
    last_name: this._fb.control('', [Validators.required]),
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

  register() {
    this._authService
      .postRegister(this.form.value)
      .pipe(this.onSubmit)
      .subscribe((response) => {
        this._notifications.success(
          `Successfully registered. You can now log in.`
        );
        this._router.navigate(
          [{ outlets: { auth: ['account', 'auth', 'login'] } }],
          {
            queryParamsHandling: 'preserve',
          }
        );
      });
  }
}
