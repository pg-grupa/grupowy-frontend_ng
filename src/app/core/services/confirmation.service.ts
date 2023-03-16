import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

type BtnClass =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export type Answer<T> = {
  value: T;
  btnClass: BtnClass;
  btnText: string;
};

export type Question = {
  question: string;
  helpText?: string;
  answers: Array<Answer<any>>;
};

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private _answerSubject?: Subject<any>;
  private _questionSubject: Subject<Question>;

  get question$(): Observable<any> {
    return this._questionSubject.asObservable();
  }

  get answer$(): Observable<any> | undefined {
    if (this._answerSubject && !this._answerSubject.closed) {
      return this._answerSubject.asObservable();
    }
    return undefined;
  }

  constructor() {
    this._questionSubject = new Subject();
  }

  ask<T>(question: string, helpText: string, ...answers: Answer<T>[]) {
    this._answerSubject = new Subject<T>();
    this._questionSubject.next({ question, helpText, answers });
    return this._answerSubject.asObservable();
  }

  answer<T>(value: T) {
    if (this._answerSubject && !this._answerSubject.closed) {
      this._answerSubject.next(value);
      this._answerSubject.complete();
      this._answerSubject = undefined;
    }
  }
}
