import { Component, OnInit } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  constructor(private translate: TranslateService, public global: GlobalService) { }

  ionViewDidEnter(): void {

    // if (this.cookie.get('language')) {
    //   this.lang = this.cookie.get('language');
    // }
    // if (this.cookie.get('notation')) {
    //   this.notation = this.cookie.get('notation');
    // }
    // if (this.cookie.get('instrument')) {
    //   this.instrument = this.cookie.get('instrument');
    // }

    this.translate.setDefaultLang(this.global.language);
    this.translate.use(this.global.language);
  }

  public notationClick(lang: string) {
    // this.notation = lang;
    this.global.notation = lang;
    console.log(this.global.notation)
    // this.cookie.set('notation', this.notation);
  }

  public languageClick(lang: string) {
    // this.cookie.set('language', lang);
    this.global.language = lang;
    console.log(this.global.language)
    this.translate.use(this.global.language);
  }

  ngOnInit() {

  }
}
