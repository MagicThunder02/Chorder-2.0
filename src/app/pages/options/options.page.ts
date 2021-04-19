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

  public instruments: string[] = ["cello", "contrabass", "guitar-nylon", "guitar-acoustic", "harmonium", "piano", "saxophone"];

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

  public optionClick(parameter, value) {

    switch (parameter) {
      case 'notation':
        this.global.notation = value;
        console.log(this.global.notation)
        break;

      case 'language':
        this.global.language = value;
        console.log(this.global.language)
        this.translate.use(this.global.language);
        break;

      case 'instrument':
        this.global.instrument = value;
        console.log(this.global.instrument)
        break;
    }
  }

  ngOnInit() {

  }
}
