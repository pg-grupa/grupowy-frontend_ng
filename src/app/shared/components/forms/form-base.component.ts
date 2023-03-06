import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

/**
 * Component base class with server-side form errors handling.
 * Use this.onSubmit observable operator to take full advantage of this class.
 *
 * ### Member variables:
 *  - `form: FormGroup`           - form that must be initialized with FormBuilder in ngOnInit
 *  - `loading: boolean`          - whether component is waiting for server response,
 *                                  can be used in template, ex. to disable submit button
 *  - `nonFieldErrors: string[]`  - non-field errors returned by the server
 *  - `fc`                        - form controls getter, for convenient access in template
 *
 * ### Methods:
 *  - `protected _handleErrors(response: any)` - add errors from response to nonFieldErrors
 *                              and field errors to individual form fields. Rethrows error at the end.
 *                              Override to customize error handling.
 *
 * ### onSubmit operator:
 *  Observable operator that pipes _handleErrors method and sets components `loading` flag to `true`
 *  at the beggining of request and to `false` at the end.
 *
 *   #### Usage
 * ```
 * onClick() {
 *  this.dataService.getData()
 *    .pipe(this.onSubmit) // catches errors and sets this.loading flag at the start and at the end of subscription
 *    .subscribe(data => { // successful response - do something })
 * }
 * ```
 */
export abstract class FormBaseComponent {
  form!: FormGroup; // ! initialize with FormBuilder
  loading: boolean = false;
  nonFieldErrors: string[] = [];

  /** Form controls getter, for convenient access in template. */
  public get fc() {
    return this.form.controls;
  }

  /**
   * Observable operator that pipes _handleErrors method and sets components `loading` flag to `true`
   * at the beggining of request and to `false` at the end.
   *
   * ## Usage
   * ```
   * onClick() {
   *   this.dataService.getData()
   *     .pipe(this.onSubmit) // catches errors and sets this.loading flag at the start and at the end of subscription
   *     .subscribe(data => { // successful response - do something })
   * }
   * ```
   */
  protected onSubmit = <T>(observable: Observable<T>): Observable<T> => {
    // mark all fields as touched, so that errors were properly displayed
    // in case server returned errors for untouched inputs
    this.form.markAllAsTouched();
    this.form.disable();

    this.loading = true;

    // pipe errors catching and after subscriptions end, set loading flag to false
    return observable.pipe(
      catchError((error) => {
        this._handleErrors(error);
        throw error;
      }),
      finalize(() => {
        this.loading = false;
        this.form.enable();
      })
    );
  };

  /**
   * add errors from response to nonFieldErrors and field errors to individual form fields.
   * Rethrows error at the end. Override to customize error handling.
   */
  protected _handleErrors(response: any) {
    if (response instanceof HttpErrorResponse) {
      this.nonFieldErrors = [];
      if ('non_field_errors' in response.error) {
        this.nonFieldErrors = response.error['non_field_errors'];
      }
      for (let key in response.error) {
        if (key === 'non_field_errors') continue;
        this.form.get(key)?.setErrors({ serverErrors: response.error[key] });
      }
    }
  }
}
