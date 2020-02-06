import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'musicSymbols'
})
export class MusicSymbolsPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    
    //delta
    value = value.toString().replace('^', '\u0394');

    //bemolle
    value = value.toString().replace(/b/g, '\u266D');

    // | to ' '
    value = value.toString().replace('|', ' ');

    return value;
  }

}
