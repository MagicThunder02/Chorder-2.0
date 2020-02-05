import { Component, OnInit } from '@angular/core';
import { Music, Chord, ChordComponent } from '../../services/music.model';
import { MusicService } from '../../services/music.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { PopoverController } from '@ionic/angular';
import { HelperComponent } from '../../utilities/helper/helper.component';
import { SimpleTimer } from 'ng2-simple-timer';

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

  constructor(private musicService: MusicService, private popoverCtrl: PopoverController,
    private translate: TranslateService, private cookie: CookieService, private st: SimpleTimer) {
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


  public findNotes(formula: string[]): string[] {
    let retArray: string[] = [];
    //cerca le note che compongono l'accordo 
    this.musicData.tonalities.forEach(tonality => {
      if (tonality.Name == this.keyplace) {
        formula.forEach(num => {
          num = num.replace('9', '2');
          num = num.replace('11', '4');
          num = num.replace('13', '6');
          tonality.intervals.forEach(int => {
            if (int.dist == num) {
              retArray.push(int.name);
            }
          })
        })
      }
    })
    console.log(retArray)
    return retArray;
  }

  public makeComponents(formula: string[]): ChordComponent[] {
    // console.log('succhia', formula);
    let notes: string[] = this.findNotes(formula);
    let components: ChordComponent[] = [];

    //se la formula richiede l'ottava il componente viene creato con essa
    notes.forEach((note, idx) => {
      if (formula[idx].includes('9') || formula[idx].includes('11') || formula[idx].includes('13')) {
        let component: ChordComponent = { selected: note, octaveSelected: true };
        components.push(component);
      } else {
        let component: ChordComponent = { selected: note, octaveSelected: false };
        components.push(component);
      }
    })

    return components;
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