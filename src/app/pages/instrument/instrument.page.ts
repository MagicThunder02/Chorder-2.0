import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.page.html',
  styleUrls: ['./instrument.page.scss'],
})
export class InstrumentPage implements OnInit {

  constructor() { }

  public boardClick(event) {
    console.log(event)
  }

  ngOnInit() {
  }

}
