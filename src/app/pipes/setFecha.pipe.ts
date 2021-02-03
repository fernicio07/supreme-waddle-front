import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

@Pipe({
  name: 'setFecha'
})
export class SetFechaPipe implements PipeTransform {

  transform(value: string) {
    return moment.utc(value).format('MM/DD/YYYY');
  }

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

}
