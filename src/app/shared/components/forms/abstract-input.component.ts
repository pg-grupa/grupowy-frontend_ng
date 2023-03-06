import { Component, Injector, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  template: '',
})
export abstract class AbstractInputComponent<T = any>
  implements ControlValueAccessor, OnInit
{
  protected _value!: T;

  control?: NgControl;

  disabled: boolean = false;

  @Input() placeholder: string | null = null;
  @Input() autocomplete: string | null = null;

  constructor(private _injector: Injector) {}

  ngOnInit(): void {
    this.control = this._injector.get(NgControl);
    if (this.control) {
      this.control.valueAccessor = this;
    }
  }

  get value(): T {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
    this.onChange(value);
  }

  onChange: (value: T) => void = (value: T) => {};
  onTouched: () => void = () => {};

  writeValue(obj: T): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public get invalid(): boolean | null {
    return this.control ? this.control.invalid : false;
  }
}
