import { Component, OnInit } from '@angular/core';
import { MusicService } from 'src/app/services/music.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { BoardModel } from './board.model';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.page.html',
  styleUrls: ['./instrument.page.scss'],
})
export class InstrumentPage implements OnInit {

  private guitarBoard: BoardModel = {
    offsetX: 0,
    offsetY: 0,
    kX: 0,
    kY: 0,
    thresholdX: 0,
    thresholdY: 0,
  };

  constructor(private musicService: MusicService, private translate: TranslateService,
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
