import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full">
      @if (label) {
        <label
          [for]="inputId"
          class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {{ label }}
        </label>
      }
      <input
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [autocomplete]="autocomplete"
        [value]="value"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
        [class]="inputClasses"
      />
      @if (error) {
        <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() error = '';
  @Input() inputId = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() autocomplete = '';

  value = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get inputClasses(): string {
    const base =
      'block w-full rounded-md border-gray-300 shadow-sm transition-colors focus:border-brand-500 focus:ring-brand-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400';
    const errorClass = this.error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
    return `${base} ${errorClass}`;
  }

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(target.value);
  }
}
