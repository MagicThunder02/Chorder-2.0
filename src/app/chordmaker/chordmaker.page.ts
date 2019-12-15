import { Component, OnInit } from '@angular/core';
import { MusicService } from '../services/music.service';
import { Music, ChordComponent, Tonality, Interval } from '../services/music.model';


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


  constructor(private musicService: MusicService) {
    this.musicData = <Music>{};
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
      this.components = [{ selected: '', intervals: clone }]
    }
  }

  /*-----------------------------------------------------------------------------------------------
    elimino la nota
  -----------------------------------------------------------------------------------------------*/
  public deleteNote(idx) {
    this.components.splice(idx, 1);
    this.checkHides();
  }

  /*-----------------------------------------------------------------------------------------------
    evento sulla selezione di una nota
  -----------------------------------------------------------------------------------------------*/
  public selectedNote(idx: number, component: ChordComponent): void {
    // console.log(`i: ${idx} c: ${JSON.stringify(component)}`);

    if ((idx < 6) && (idx == this.components.length - 1)) {
      let clone: Interval[] = JSON.parse(JSON.stringify(this.actualTonality.intervals));
      this.components.push({ selected: '', intervals: clone });
    }

    this.checkHides();

    let notes: string[] = [];
    this.components.forEach(c => {
      notes.push(c.selected);
    })

    let grades: string[] = this.gradeFinder(notes);
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

  private matchChord(grades: string[]): string[] {
    let result: string[] = [];

    console.log(grades);

    this.musicData.chords.forEach(chord => {
      if (this.matcher(chord.formula, grades)) {
        chord.names.forEach(name => {
          result.push(this.selectedTonic + name);
        })
      }
    })

    console.log('r', result);
    return result;
  }

  ngOnInit() {

    this.musicService.getData().subscribe((res) => {
      this.musicData = res;
      console.log(this.musicData);
    })
  }
}
