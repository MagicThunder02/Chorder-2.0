import { Pipe, PipeTransform } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Pipe({
  name: 'musicNotation'
})
export class MusicNotationPipe implements PipeTransform {


  constructor(public global?: GlobalService) {
  }

  transform(value: string, ...args: string[]): string {

    if (this.global.notation == 'normal') {

      value = value.toString().replace('D', 'Re');
      value = value.toString().replace('C', 'Do');
      value = value.toString().replace('E', 'Mi');
      value = value.toString().replace('F', 'Fa');
      value = value.toString().replace('G', 'Sol');
      value = value.toString().replace('A', 'La');
      value = value.toString().replace('B', 'Si');
    }

    value = value = value.toString().replace('b', '\u266D');
    value = value = value.toString().replace('#', '\u266F');

    return value;
  }

}
