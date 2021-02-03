import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appZipCodeMask]',
})
export class ZipCodeMaskDirective {

  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event);
  }

  // @HostListener('keydown.backspace', ['$event'])
  // keydownBackspace(event) {
  //   this.onInputChange(event.target.value, true);
  // }
  

  onInputChange(event) {
      if(event) {
          let newVal = event.replace(/\D/g, '');
          if(newVal.length > 9) {
            newVal = newVal.substring(0, 9);
          }
          if (newVal.length === 0) {
            newVal = '';
          } else if (newVal.length <= 5) {
            newVal = newVal.replace(/^(\d{0,5})/, '$1');
          } else {
            newVal = newVal.substring(0, 9);
            newVal = newVal.replace(/^(\d{0,5})(\d{0,4})/, '$1-$2');
          }
          this.ngControl.valueAccessor.writeValue(newVal);
      }
  }
}
