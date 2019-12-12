import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notefinder',
  templateUrl: 'notefinder.page.html',
  styleUrls: ['notefinder.page.scss']
})
export class Notefinder implements OnInit { 
  private selectedItem: any;
  private icons = [
    'note',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor() {
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Note ' + i,
        note: 'Do' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
