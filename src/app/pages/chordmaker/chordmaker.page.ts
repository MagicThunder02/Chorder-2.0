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
  color: string;
  selected?: boolean;
}

export interface myChord {
  name?: string[];
  symbol?: string;
  tonic?: string;
  root?: string;
  type?: string;
  aliases?: string[];
  intervals?: string[];
  extensions?: string[];
  reductions?: string[];
  notes?: string[];
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
  public selecedTiles: Tile[] = [];
  public chord: myChord = { empty: true };
  public expandReduction: boolean = false;
  public expandExtensions: boolean = false;

  // private synth = new Tone.PolySynth().toDestination();
  private synth;

  constructor(private translate: TranslateService, public global: GlobalService, private modalCtrl: ModalController) {

    this.synth = new Tone.Sampler({
      urls: {
        A2: "pianoA2.wav",
      },
      baseUrl: "assets/instruments/",

    }).toDestination();
  }

  selectInstrument() {
    this.synth = '';

    console.log(this.global.instrument)
    this.synth = new Tone.Sampler({
      urls: {
        A2: this.global.instrument + "A2.wav",
      },
      baseUrl: "assets/instruments/",

    }).toDestination();
  }

  resetTiles() {
    this.selecedTiles = [];
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
    if (this.selecedTiles.includes(tile)) {
      this.selecedTiles.splice(this.selecedTiles.indexOf(tile), 1);
    }
    else {
      this.selecedTiles.push(tile);
    }


    if (tile.selected == false) {
      tile.selected = true;
    } else {
      tile.selected = false;
    }
  }

  //check if two note with the same value are both checked, if yes deselects the last selected one
  checkEquals(selectedTile: Tile) {

    this.selecedTiles.forEach((tile) => {

      //if the interval is 0 
      let interval = Interval.distance(selectedTile.name, tile.name);
      if (interval == "0A" || interval == "2d") {
        tile.selected = false
        this.selecedTiles.splice(this.selecedTiles.indexOf(tile), 1);
      }
    });

  }

  //color the tiles if selected
  colorTiles() {

    this.tiles.forEach(tile => {
      tile.color = "light";
    })

    this.selecedTiles.forEach((selecedTile, idx) => {
      let found = this.tiles.find(tile => {
        return tile == selecedTile;
      })
      if (idx == 0) {
        found.color = "tertiary";
      }
      else {
        found.color = "secondary";
      }

    })
  }

  findChord() {
    let filter: string;

    if (this.selecedTiles[0]) {
      filter = this.selecedTiles[0].name;
    }

    let notes: string[] = this.selecedTiles.map(tile => {
      return tile.name;
    });

    if (notes.length >= 2) {
      let chordsList = Chord.detect(notes);
      let filteredChord = chordsList.find(chordName => {

        return chordName.slice(0, 2).includes(filter);
      })

      let tmpChord = Chord.get(filteredChord);
      console.log(tmpChord)
      this.chord.symbol = tmpChord.symbol;
      this.chord.name = tmpChord.name.split(" ");
      this.chord.tonic = tmpChord.tonic;
      this.chord.root = tmpChord.root;
      this.chord.intervals = tmpChord.intervals;
      this.chord.aliases = tmpChord.aliases;
      this.chord.type = tmpChord.type;
      this.chord.notes = tmpChord.notes;
      this.chord.extensions = Chord.extended(tmpChord.symbol);
      this.chord.reductions = Chord.reduced(tmpChord.symbol);
      this.chord.empty = tmpChord.empty;

      console.log('filter', filter, 'filteredchord', 'chordlist', chordsList)
    }
    else {
      this.chord.empty = true;
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


  public beautify(array: string[], pipe: boolean = true) {
    let myString: string = '';

    switch (pipe) {

      case true:
        if (array) {
          array.forEach((element, idx) => {
            if (idx != 0 && idx != array.length && element != '') {
              myString = myString + ", " + this.musicNotationPipe.transform(element);
            }
            else {
              myString = myString + this.musicNotationPipe.transform(element);
            }

          })
          return myString;
        }
        break;

      case false: array.forEach((element, idx) => {
        if (idx != 0 && idx != array.length && element != '') {
          myString = myString + ", " + element;
        }
        else {
          myString = myString + element
        }

      })
        return myString;
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
    console.log(this.tiles);

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
