import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'musicNotation'
})
export class MusicNotationPipe implements PipeTransform {

  constructor() {
  }

  transform(value: string, notation: string, ...args: string[]): string {

    value = value.toString().replace('D', 'Re');
    value = value.toString().replace('C', 'Do');
    value = value.toString().replace('E', 'Mi');
    value = value.toString().replace('F', 'Fa');
    value = value.toString().replace('G', 'Sol');
    value = value.toString().replace('A', 'La');
    value = value.toString().replace('B', 'Si');

    value = value = value.toString().replace('b', '\u266D');
    value = value = value.toString().replace('#', '\u266F');

    return value;
  }

}
