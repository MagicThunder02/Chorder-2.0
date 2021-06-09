import { Component, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Chord, Interval } from "@tonaljs/tonal";
import * as Tone from 'tone';
import { MusicNotationPipe } from 'src/app/pipes/music-notation.pipe';
import { GlobalService } from 'src/app/services/global.service';
import { ModalController } from '@ionic/angular';
import { InfoModalComponent } from '../infoModal/infoModal.component';
// import * as SampleLibrary from 'tjss.js';


export interface Tile {
  name: string;
  color?: string;
  selected?: boolean;
}

export interface myChord {
  name?: string[];
  symbol?: string;
  tonic?: string;
  root?: string;
  type?: string;
  aliases?: string[];
  intervals?: { symbols: string[], quality: string[], numbers: String[] };
  extensions?: { open: boolean, values: string[] };
  reductions?: { open: boolean, values: string[] };
  notes?: string[];
  quality?: string;
  show?: boolean;
  empty?: boolean;
}

@Component({
  selector: 'app-chordmaker',
  templateUrl: './chordmaker.page.html',
  styleUrls: ['./chordmaker.page.scss'],
})
export class ChordmakerPage implements OnInit {

  private musicNotationPipe = new MusicNotationPipe(this.global);
  private translatePipe = new TranslatePipe(this.translate, null);

  public tiles: Tile[] = [];
  public selectedTiles: Tile[] = [];
  public chord: myChord = { empty: true };


  constructor(private translate: TranslateService, public global: GlobalService, private modalCtrl: ModalController) {
    console.log(global.language)

  }

  resetTiles() {
    this.selectedTiles = [];
    this.colorTiles();
    this.chord = { empty: true }
  }

  selectTile(tile: Tile) {
    this.toggleTile(tile)
    this.checkEquals(tile)
    this.colorTiles()
    this.findChord()
  }


  //select or deselect a tile
  toggleTile(tile: Tile) {
    if (this.selectedTiles.includes(tile)) {
      this.selectedTiles.splice(this.selectedTiles.indexOf(tile), 1);
    }
    else {
      this.selectedTiles.push(tile);
    }


    if (tile.selected == false) {
      tile.selected = true;
    } else {
      tile.selected = false;
    }
  }

  //check if two note with the same value are both checked, if yes deselects the last selected one
  checkEquals(selectedTile: Tile) {

    this.selectedTiles.forEach((tile) => {

      //if the interval is 0 
      let interval = Interval.distance(selectedTile.name, tile.name);
      if (interval == "0A" || interval == "2d") {
        tile.selected = false
        this.selectedTiles.splice(this.selectedTiles.indexOf(tile), 1);
      }
    });

  }

  //color the tiles if selected
  colorTiles() {

    this.tiles.forEach(tile => {
      tile.color = "light";
    })

    this.selectedTiles.forEach((selectedTile, idx) => {
      let found = this.tiles.find(tile => {
        return tile.name == selectedTile.name;
      })

      if (idx == 0) {
        found.color = "tertiary";
      }
      else {
        found.color = "secondary";
      }

    })
  }

  intervalToNumber(intervals: string[]) {
    return intervals.map(interval => {
      let number = "";
      // console.log(interval.slice(0, -1), interval)


      switch (interval.slice(0, -1)) {
        case "1":
          number = "unison";
          break;
        case "2":
          number = "second";
          break;
        case "3":
          number = "third";
          break;
        case "4":
          number = "fourth";
          break;
        case "5":
          number = "fifth";
          break;
        case "6":
          number = "sixth";
          break;
        case "7":
          number = "seventh";
          break;
        case "8":
          number = "seventh";
          break;
        case "9":
          number = "ninth";
          break;
        case "11":
          number = "eleventh";
          break;
        case "13":
          number = "thirteenth";
          break;
      }

      return number;
    })
  }

  intervalToQuality(intervals: string[]) {
    return intervals.map(interval => {
      let quality = "";

      switch (interval[interval.length - 1]) {
        case "P":
          if (interval[0] != "1") {
            quality = "perfect"
          }
          break;
        case "m":
          quality = "minor"
          break;
        case "M":
          quality = "major"
          break;
        case "d":
          quality = "diminished-f"
          break;
        case "A":
          quality = "augmented-f"
          break;
      }

      return quality;
    })
  }

  assembleChord(chordName) {
    let tmpChord = Chord.get(chordName);
    this.chord.symbol = tmpChord.symbol;
    this.chord.name = tmpChord.name.split(" ");
    this.chord.tonic = tmpChord.tonic;
    this.chord.root = tmpChord.root;
    this.chord.intervals = {
      symbols: tmpChord.intervals,
      quality: this.intervalToQuality(tmpChord.intervals),
      numbers: this.intervalToNumber(tmpChord.intervals)
    };
    this.chord.aliases = tmpChord.aliases;
    this.chord.type = tmpChord.type;
    this.chord.notes = tmpChord.notes;
    this.chord.extensions = { open: false, values: Chord.extended(tmpChord.symbol) };
    this.chord.reductions = { open: false, values: Chord.reduced(tmpChord.symbol) };
    this.chord.quality = tmpChord.quality;
    this.chord.empty = tmpChord.empty;
  }

  findChord() {
    let filter: string;

    if (this.selectedTiles[0]) {
      filter = this.selectedTiles[0].name;
    }

    let notes: string[] = this.selectedTiles.map(tile => {
      return tile.name;
    });


    if (notes.length >= 2) {
      let chordsList = Chord.detect(notes);

      let filteredChord = chordsList.find(chordName => {
        return chordName.slice(0, 2).includes(filter);
      })

      this.assembleChord(filteredChord);

      console.log(this.chord)
    }
    else {
      this.chord.empty = true;
    }

  }

  inputChord(chordName) {

    this.assembleChord(chordName);

    this.selectedTiles = [];
    this.chord.notes.forEach(note => {
      this.selectedTiles.push({ name: note, color: "light" })
    })

    this.colorTiles();

    console.log(chordName, this.chord)
  }


  ngOnInit() {
    let scale = ["Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "B#"]
    scale.forEach((note, idx) => {
      this.tiles.push({ name: note, color: "light", selected: false })
    });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: InfoModalComponent,
      componentProps: {
        pageName: "chordmaker",
      },
      cssClass: 'fullscreen'
    });
    await modal.present();
  }

}
