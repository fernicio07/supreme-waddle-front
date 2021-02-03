import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appSeguroSocialMask]',
})
export class SeguroSocialMaskDirective {

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
          } else if (newVal.length <= 3) {
            newVal = newVal.replace(/^(\d{0,3})/, '$1');
          } else if (newVal.length < 6) {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,2})/, '$1-$2');
          } else if (newVal.length == 6) {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,2})(\d{0,4})/, '$1-$2-$3');
          } else if (newVal.length <= 10) {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,2})(\d{0,4})/, '$1-$2-$3');
          } else {
            newVal = newVal.substring(0, 10);
            newVal = newVal.replace(/^(\d{0,3})(\d{0,2})(\d{0,4})/, '$1-$2-$3');
          }
          this.ngControl.valueAccessor.writeValue(newVal);
      }
  }
}
