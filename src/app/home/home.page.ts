import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html'
})
export class HomePage implements OnInit {

  title: string;

  constructor(private translate: TranslateService, private cookie: CookieService) { }

  ionViewDidEnter(): void {
    this.translate.setDefaultLang('en');
    let lang = this.cookie.get('language');
    if (lang) {
      this.translate.use(lang);
    }
    /*     this.translate.get('title').subscribe((res: string) => {
          console.log(res);
          this.title = res;
        }); */
  }

  ngOnInit() {

  }
}
