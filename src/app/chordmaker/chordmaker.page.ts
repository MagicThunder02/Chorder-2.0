import { Component, OnInit } from '@angular/core';
import { MusicService } from '../services/music.service';
import { Observable } from 'rxjs';
import { Music } from '../services/music.model';

@Component({
  selector: 'app-chordmaker',
  templateUrl: './chordmaker.page.html',
  styleUrls: ['./chordmaker.page.scss'],
})
export class ChordmakerPage implements OnInit {

  private musicData: Music;
  private query: Observable<Music>;
  private keyplace: any;
  private selectedTonic: string;
  public intervalsToDisplay: any[];
  public numberX: number[];
  public noteplace: any[] = [];


  constructor(private musicService: MusicService) {
    this.intervalsToDisplay = [];
    this.numberX = [];

    //creo un array di n elementi per iterare con l'ngFor
    for (let i = 0; i < 7; i++) {
      this.numberX.push(i);
    }
  }

  public selectedKey(): void {
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
  }

  ngOnInit() {
    this.query = this.musicService.getData();
    console.log(this.query);
    this.query.subscribe((res) => {
      this.musicData = res;
      console.log(this.musicData);
    })

    //imposto il do come tonica predefinita riempiendo le select con le note della tonalità do 
    this.intervalsToDisplay = [];
    /*  this.musicData[0].intervals.forEach(interval => {
       this.intervalsToDisplay.push(interval.name);
     }) */
  }

}
