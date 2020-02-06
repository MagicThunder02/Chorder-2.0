import { Component, OnInit } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { TranslateService } from '@ngx-translate/core';
import { InstrumentsService } from 'src/app/services/instruments.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  public lang: string = 'en';
  public notation: string = 'natural';
  public instrument: string = 'piano';
  public myInstruments = [];

  constructor(private cookie: CookieService, private instruments: InstrumentsService, private translate: TranslateService) { }

  ionViewDidEnter(): void {

    if (this.cookie.get('language')) {
      this.lang = this.cookie.get('language');
    }
    if (this.cookie.get('notation')) {
      this.notation = this.cookie.get('notation');
    }
    if (this.cookie.get('instrument')) {
      this.instrument = this.cookie.get('instrument');
    }

    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);

  }

  public radioInstrument(event: any) {
    console.log(event.detail)
    this.instrument = event.detail.value
    this.cookie.set('instrument', this.instrument);
  }

  public notationClick(lang: string) {
    this.notation = lang;
    this.cookie.set('notation', this.notation);
  }

  public languageClick(lang: string) {
    this.cookie.set('language', lang);
    location.reload();
  }

  ngOnInit() {
    this.instruments.getData().subscribe((res) => {
      Object.keys(res.instruments).forEach(key => {
        this.myInstruments.push(res.instruments[key])
      })
      console.log(this.myInstruments);
    })
  }

}
