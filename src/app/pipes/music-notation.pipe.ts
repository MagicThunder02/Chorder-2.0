import { Pipe, PipeTransform } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Pipe({
  name: 'musicNotation'
})
export class MusicNotationPipe implements PipeTransform {
  private notation = 'european';

  constructor(private cookie: CookieService) {
    this.notation = this.cookie.get('notation');
  }
  transform(value: string, notation: string, ...args: string[]): string {

    switch (this.notation) {
      case 'european':
        return value;
        break;

      case 'american':
        value = value.toString().replace('Do', 'C');
        value = value.toString().replace('Re', 'D');
        value = value.toString().replace('Mi', 'E');
        value = value.toString().replace('Fa', 'F');
        value = value.toString().replace('Sol', 'G');
        value = value.toString().replace('La', 'A');
        value = value.toString().replace('Si', 'B');
        break;
    }

    return value;
  }

}
