import { Component, OnInit } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  public lang: string = 'en'; 
  constructor(private cookie: CookieService, private translate: TranslateService) { }

  ionViewDidEnter(): void {
    
    this.lang = this.cookie.get('language');

    this.translate.setDefaultLang('en');

    if (!this.lang) {
      this.cookie.set('language', 'en');
    }
    
    if (this.lang) {
      this.translate.use(this.lang);
    }
  }

  private languageClick(lang:string) {
    this.cookie.set('language', lang);
    location.reload();
  }

  ngOnInit() {
  }

}
