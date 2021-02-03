import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setTipoPago'
})
export class SetTipoPagoPipe implements PipeTransform {

  transform(value: string) {
    let text = '';
    switch (value) {
      case 'EF':
        text = 'Efectivo';
        break;
      case 'ATH':
        text = 'ATH';
        break;
      case 'CH':
        text = 'Cheque';
        break;
      case 'V':
        text = 'Visa';
        break;
      case 'M':
        text = 'Mastercard';
        break;
      case 'AE':
        text = 'American Express';
        break;
      case 'VME':
        text = 'Visa/MasterCard Elect';
        break;
      case 'AEE':
        text = 'American Express Elect';
        break;    
      default:
        break;
    }
    return text;
  }

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

}
