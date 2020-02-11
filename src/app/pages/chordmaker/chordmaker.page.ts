import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { Music, ChordComponent, Tonality, Interval } from '../../services/music.model';
import { HelperComponent } from '../../utilities/helper/helper.component';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { SimpleTimer } from 'ng2-simple-timer';

// import { Media, MediaObject } from '@ionic-native/media/ngx';s


// import * as MidiWriter from 'midi-writer-js';


@Component({
  selector: 'app-chordmaker',
  templateUrl: './chordmaker.page.html',
  styleUrls: ['./chordmaker.page.scss'],
})
export class ChordmakerPage implements OnInit {

  private musicData: Music;
  private keyplace: string;
  private selectedTonic: string;
  public noteplace: string[] = [];
  public components: ChordComponent[] = [];
  private actualTonality: Tonality;
  public FinalChords: string[] = [];


  constructor(private musicService: MusicService, private popoverCtrl: PopoverController,
    private translate: TranslateService, private cookie: CookieService) {
    this.musicData = <Music>{};
  }

  ionViewDidEnter(): void {

    this.translate.setDefaultLang('en');

    let lang = this.cookie.get('language');

    if (lang) {
      this.translate.use(lang);
    }
  }


  private checkHides() {
    let toRemoveArray: string[] = [];

    //array di note da togliere
    this.components.forEach(cmp => {
      if (cmp.selected != '') {
        toRemoveArray.push(cmp.selected);
      }
    })

    //ripristiniamo visibili tutte le note
    this.components.forEach((cmp, index) => {
      cmp.intervals.forEach(int => {
        int.hide = false;
      })
    })

    this.components.forEach((cmp, index) => {
      toRemoveArray.forEach(rem => {
        cmp.intervals.forEach(int => {
          if (int.name == rem) {
            //se la nota da rimuovere è diversa da quella selezionata
            if (rem != cmp.selected) {
              int.hide = true;
              // console.log(`idx: ${index} rem: ${rem} cmp: ${JSON.stringify(this.actualTonality.intervals)}`);
            }
          }
        })
      })
    })


  }

  /*-----------------------------------------------------------------------------------------------
    se il grado è uguale a 2, 4 o 6 abilita il selettore dell'ottava 
    -----------------------------------------------------------------------------------------------*/
  public showOctaveButton(component: ChordComponent) {
    let lastNote: string[] = [];

    lastNote.push(component.selected);
    let dist = this.gradeFinder(lastNote);

    if ((dist[0].includes('2')) || (dist[0].includes('4')) || (dist[0].includes('6'))) {
      component.octaveEnable = true;
    }
    else {
      component.octaveEnable = null;
      component.octaveSelected = false;
    }
  }

  /*-----------------------------------------------------------------------------------------------
    elimino la scelta della tonica e ripristino le condizioni di partenza
  -----------------------------------------------------------------------------------------------*/
  public deleteKey() {
    this.selectedTonic = '';
    this.keyplace = '';
    this.actualTonality = null;
    this.components = [];
  }

  /*-----------------------------------------------------------------------------------------------
    evento sulla selezione della tonica
  -----------------------------------------------------------------------------------------------*/
  public selectedKey(): void {
    this.selectedTonic = this.keyplace;
    if (this.keyplace != '') {
      //creo un array con le note che saranno nelle tendine delle note
      this.musicData.tonalities.forEach(tonality => {
        if (tonality.Name == this.selectedTonic) {
          //memorizziamo la tonalità scelta
          this.actualTonality = tonality;
        }
      })

      //inizializiamo l'array dei componenti con un solo elemento
      let clone: Interval[] = JSON.parse(JSON.stringify(this.actualTonality.intervals));
      this.components = [{ selected: '', intervals: clone, octaveSelected: false, octaveEnable: false }]
    }

  }

  /*-----------------------------------------------------------------------------------------------
    elimino la nota
  -----------------------------------------------------------------------------------------------*/
  public deleteNote(idx) {
    this.components.splice(idx, 1);
    this.checkHides();
    this.selectedNote();
  }

  /*-----------------------------------------------------------------------------------------------
    evento sulla selezione di una nota
  -----------------------------------------------------------------------------------------------*/
  public selectedNote(idx?: number, component?: ChordComponent): void {
    // console.log(`i: ${idx} c: ${JSON.stringify(component)}`);

    if (component) {
      if ((idx < 6) && (idx == this.components.length - 1)) {
        let clone: Interval[] = JSON.parse(JSON.stringify(this.actualTonality.intervals));
        this.components.push({ selected: '', intervals: clone, octaveSelected: false, octaveEnable: false });
      }
    }

    this.checkHides();

    let notes: string[] = [];
    this.components.forEach(c => {
      notes.push(c.selected);
    })

    if (component) {
      this.showOctaveButton(component);
    }

    let grades: string[] = this.gradeFinder(notes);

    grades.forEach((g, index) => {
      if (g.includes('2')) {
        if (this.components[index].octaveSelected) {
          g = g.replace('2', '9')
          grades[index] = g;
        }
      }
      if (g.includes('4')) {
        if (this.components[index].octaveSelected) {
          g = g.replace('4', '11')
          grades[index] = g;
        }
      }
      if (g.includes('6')) {
        if (this.components[index].octaveSelected) {
          g = g.replace('6', '13')
          grades[index] = g;
        }
      }
    })

    console.log(grades)
    this.matchChord(grades);
  }


  private gradeFinder(chord: string[]): string[] {

    //per ogni nota selezionata trovo l'intervallo corrispondente nella sua tonalità
    let found: string[] = [];

    chord.forEach(note => {
      this.musicData.tonalities.forEach(tonality => {
        if (tonality.Name == this.selectedTonic) {
          tonality.intervals.forEach(myinterval => {
            if (note == myinterval.name) {
              found.push(myinterval.dist);
            }
          })
        }
      })
    })

    return found;
  }

  private matcher(master: string[], child: string[]): boolean {
    master.sort();
    child.sort();

    let i: number, j: number;

    for (i = 0, j = 0; i < master.length && j < child.length;) {
      if (master[i] < child[j]) {
        ++i;
      } else if (master[i] == child[j]) {
        ++i; ++j;
      } else {
        return false;
      }
    }

    return j == child.length;
  }

  //la funzione "ritorna" tutti i sottoinsiemi che combaciano
  private matchChord(grades: string[]): void {
    let chordResult: string[] = [];
    let AllChordsFound: any = [];

    this.musicData.chords.forEach(chord => {
      if (this.matcher(chord.formula, grades)) {
        chordResult = [];
        chord.names.forEach(name => {
          chordResult.push(this.selectedTonic + name);
        })
        AllChordsFound.push(chordResult);
      }
    })

    // console.log('r', AllChordsFound);
    this.FinalChords = AllChordsFound;
  }


  ngOnInit() {
    this.musicService.getData().subscribe((res) => {
      this.musicData = res;
      console.log(this.musicData);
    })
  }

  //popover function
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
