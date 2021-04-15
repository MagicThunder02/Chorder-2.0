import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.page.html',
  styleUrls: ['./instrument.page.scss'],
})
export class InstrumentPage implements OnInit {


  constructor(private translate: TranslateService,
    private cookie: CookieService) {

  }

  // public boardClick(event) {
  //   let X0 = event.clientX;
  //   let Y0 = event.clientY;
  //   console.table(X0, Y0, event);
  // }

  ngOnInit() {
  }

}
