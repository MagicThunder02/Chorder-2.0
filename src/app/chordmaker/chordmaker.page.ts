import { Component, OnInit } from '@angular/core';
import { MusicService } from '../services/music.service';
import { Music, Interval } from '../services/music.model';

@Component({
  selector: 'app-chordmaker',
  templateUrl: './chordmaker.page.html',
  styleUrls: ['./chordmaker.page.scss'],
})
export class ChordmakerPage implements OnInit {

  private musicData: Music;
  private keyplace: string;
  private selectedTonic: string;
  public intervalsToDisplay: Interval[];
  public numberX: number[];
  public noteplace: string[] = [];


  constructor(private musicService: MusicService) {
    this.musicData = <Music>{};
    this.intervalsToDisplay = [];
    this.numberX = [0];

  }

  public selectedKey(): void {  
    this.noteplace = [];
    this.numberX = [0];

    this.selectedTonic = this.keyplace;
    console.log(this.keyplace);

    //creo un array con le note che saranno nelle tendine delle note
    this.musicData.tonalities.forEach(tonality => {
      if (tonality.Name == this.selectedTonic) {

        this.intervalsToDisplay = tonality.intervals;
      }
    })
    console.log(this.intervalsToDisplay);
  }

  public selectedNote(): void {
    console.log(this.noteplace);
    this.numberX.push(this.numberX.length);

    /*     //elimino la nota già scelta dalle note sceglibili
        this.intervalsToDisplay.forEach(element => {
          if (element.name == this.noteplace[this.noteplace.length-1]) {
             this.intervalsToDisplay.splice(this.noteplace.length-1, 1);
          }
        }) */

    let grades: string[] = this.gradeFinder(this.noteplace);
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
