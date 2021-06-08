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


  // private synth = new Tone.PolySynth().toDestination();
  private synth;

  constructor(private translate: TranslateService, public global: GlobalService, private modalCtrl: ModalController) {
    console.log(global.language)
    this.synth = new Tone.Sampler({
      urls: {
        A2: "pianoA2.wav",
      },
      baseUrl: "assets/instruments/",

    }).toDestination();
  }

  selectInstrument() {
    this.synth = '';

    this.synth = new Tone.Sampler({
      urls: {
        A2: this.global.instrument + "A2.wav",
      },
      baseUrl: "assets/instruments/",

    }).toDestination();
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

  toggleEllipsis(parameter) {

    switch (parameter) {
      case "extensions":
        if (this.chord.extensions.open) {
          this.chord.extensions.open = false;
        }
        else {
          this.chord.extensions.open = true;
        }
        break;

      case "reductions":
        if (this.chord.reductions.open) {
          this.chord.reductions.open = false;
        }
        else {
          this.chord.reductions.open = true;
        }
        break;
    }
  }

  toggleCard(chord: myChord) {
    if (chord.show == false) {
      chord.show = true;
    } else {
      chord.show = false;
    }
    console.log(chord)
  }

  playChord(chord: myChord, mode: string) {
    //assigns octave 4 to all notes than plays them together

    let scale = ["Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "B#"]

    let notes = chord.notes.map(function (note, idx) {

      if (note.includes("##")) {
        let idx = scale.indexOf(note.slice(0, -1));
        note = scale[(idx + 2) % scale.length];
        // console.log(idx, note, scale[idx % scale.length], scale[(idx + 2) % scale.length])
      }

      if (note.includes("bb")) {
        let idx = scale.indexOf(note);
        note = scale[(idx - 2) % scale.length];
      }

      if (parseInt(chord.intervals[idx], 10) <= 7) {
        return note = note + "3"
      } else {
        return note = note + "4"
      }
    });
    // console.log(notes, chord.intervals);

    if (mode == "arp")
      notes.forEach((note, idx) => {
        this.synth.triggerAttackRelease(note, "4n", Tone.now() + idx / 2);
      })
    else {
      if (mode == "chord") {
        this.synth.triggerAttackRelease(notes, "2n");
      }
    }
  }


  ionViewDidEnter(): void {
    this.selectInstrument()
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
