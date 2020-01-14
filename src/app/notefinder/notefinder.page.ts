import { Component, OnInit } from '@angular/core';
import { Music, Chord } from '../services/music.model';
import { MusicService } from '../services/music.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { PopoverController } from '@ionic/angular';
import { HelperComponent } from '../helper/helper.component';

@Component({
  selector: 'app-notefinder',
  templateUrl: 'notefinder.page.html',
  styleUrls: ['notefinder.page.scss']
})
export class NotefinderPage implements OnInit {
  public musicData: Music;
  private keyplace: string;
  private categoryplace: string;
  public filteredChords: Chord[] = [];

  constructor(private musicService: MusicService, private popoverCtrl: PopoverController, private translate: TranslateService, private cookie: CookieService) {
    this.musicData = <Music>{};

    this.translate.setDefaultLang('en');
    let lang = this.cookie.get('language');
    if (lang) {
      this.translate.use(lang);
    }

    this.categoryplace = 'all';
  }

  //selezionata la tonica la aggiunge a ogni nome nella struttura MusicData
  public fillSearch(): void {
    this.musicData.chords.forEach((chord, index) => {
      chord.names.forEach((name, index) => {
        chord.names[index] = this.keyplace + name;
      })
    })

    //se non viene effettuata una ricerca vengono mostrati tutti gli accordi
    this.musicData.chords.forEach(chord => {
      this.filteredChords.push(chord);
    })
  }

  public catSelected(): void {
    console.log(this.categoryplace);
  }

  getChords(ev: any) {

    let serVal = ev.target.value;
    console.log(serVal)
    let tmp: any[] = [];

    this.musicData.chords.forEach(chord => {
      let found: boolean = false;
      chord.names.forEach(name => {
        if (name.includes(serVal)) {
          found = true;

        }
      })
      if (found) {
        tmp.push(chord);
      }

    })
    this.filteredChords = tmp;
  }

  ngOnInit() {
    this.musicService.getData().subscribe((res) => {
      this.musicData = res;
      console.log(this.musicData);
      
    })
  }


  async helper(ev: any, contextTitle: string, contextContent: string) {
    const popover = await this.popoverCtrl.create({
      component: HelperComponent,
      componentProps: {
        contextTitle: contextTitle,
        contextContent: contextContent
      },
      event: ev,
      showBackdrop: true,
      translucent: true
    });
    return await popover.present();
  }
}