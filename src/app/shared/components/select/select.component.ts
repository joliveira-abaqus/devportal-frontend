import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full">
      <label
        *ngIf="label"
        [attr.for]="selectId"
        class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ label }}
      </label>
      <select
        [id]="selectId"
        [ngClass]="selectClasses"
        [value]="value"
        (change)="onSelectChange($event)"
        (blur)="onTouched()"
      >
        <option *ngFor="let option of options" [value]="option.value">{{ option.label }}</option>
      </select>
      <p *ngIf="error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>
  `,
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() error = '';
  @Input() selectId = '';
  @Input() options: SelectOption[] = [];
  @Input() className = '';

  value = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get selectClasses(): string {
    const base =
      'block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100';
    const errorClass = this.error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
    return [base, errorClass, this.className].filter(Boolean).join(' ');
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
