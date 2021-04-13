import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Chord, Interval } from "@tonaljs/tonal";
import * as Tone from 'tone';
// import * as SampleLibrary from 'tjss.js';


export interface Tile {
  name: string;
  color: string;
  selected?: boolean;
}

export interface myChord {
  name?: string;
  symbol: string;
  tonic?: string;
  root?: string;
  type?: string;
  aliases?: string[];
  intervals?: string[];
  extensions?: string[];
  reductions?: string[];
  notes?: string[];
  show?: boolean;
}

@Component({
  selector: 'app-chordmaker',
  templateUrl: './chordmaker.page.html',
  styleUrls: ['./chordmaker.page.scss'],
})
export class ChordmakerPage implements OnInit {

  private tiles: Tile[] = [];
  private notes: string[] = [];
  private chords: myChord[] = [];

  private instruments: string[] = ["Cello", "Contrabass", "Guitar-Nylon", "Guitar-Acoustic ", "Harmonium", "Piano", "Saxophone"];
  private myInstrument: string = '';

  // private synth = new Tone.PolySynth().toDestination();
  private synth;

  constructor(
    private translate: TranslateService, private cookie: CookieService) {

    this.synth = new Tone.Sampler({
      urls: {
        A2: "pianoA2.wav",
      },
      baseUrl: "assets/instruments/",

    }).toDestination();
  }

  selectTile(tile: Tile) {
    this.chords = [];
    this.toggleTile(tile)
    this.checkEquals(tile)
    this.colorTiles()
    this.findChord()
  }

  selectInstrument() {
    this.synth = '';

    console.log(this.myInstrument + ".wav")

    this.synth = new Tone.Sampler({
      urls: {
        A2: this.myInstrument.toLowerCase() + "A2.wav",
      },
      baseUrl: "assets/instruments/",

    }).toDestination();
  }

  //select or deselect a tile
  toggleTile(tile: Tile) {
    if (tile.selected == false) {
      tile.selected = true;
    } else {
      tile.selected = false;
    }
  }

  //check if two note with the same value are both checked, if yes deselects the last selected one
  checkEquals(selectedTile: Tile) {
    this.tiles.forEach((tile) => {

      //if the interval is 0 
      let interval = Interval.distance(selectedTile.name, tile.name);
      if (interval == "0A" || interval == "2d") {
        tile.selected = false
      }
    });

  }

  //color the tiles if selected
  colorTiles() {
    this.tiles.forEach(tile => {
      if (tile.selected) {
        tile.color = "secondary"
      }
      else {
        tile.color = "light"
      }
    })
  }

  findChord() {
    this.notes = [];

    this.tiles.forEach(tile => {
      if (tile.selected) {
        this.notes.push(tile.name)
      }
    });

    if (this.notes.length >= 3) {

      let chordNames = Chord.detect(this.notes);
      chordNames.forEach((chordName, idx) => {
        this.chords.push({ symbol: chordName });

        if (chordName.includes("/") && (chordName.split("/")[1].length == 1 || chordName.split("/")[1].length == 2)) {
          let cropName = chordName.split("/")[0];
          let cropChord = Chord.get(cropName);
          this.chords[idx].name = cropChord.name + " slash " + chordName.split("/")[1];
          this.chords[idx].root = chordName.split("/")[1];
          this.chords[idx].intervals = cropChord.intervals;
          this.chords[idx].type = cropChord.type + " slashed";
          this.chords[idx].tonic = cropChord.tonic;

          this.chords[idx].notes = cropChord.notes;
          this.chords[idx].notes.push(chordName.split("/")[1])
        }
        else {
          let newChord = Chord.get(chordName);
          this.chords[idx].name = newChord.name;
          this.chords[idx].root = newChord.root;
          this.chords[idx].intervals = newChord.intervals;
          this.chords[idx].aliases = newChord.aliases;
          this.chords[idx].notes = newChord.notes;
          this.chords[idx].type = newChord.type;
          this.chords[idx].tonic = newChord.tonic;
        }

        this.chords[idx].extensions = Chord.extended(chordName);
        this.chords[idx].reductions = Chord.reduced(chordName);

        this.chords.forEach(chord => {
          chord.show = false;
        });
      })

      console.log(this.chords);
    }
  }

  toggleCard(chord: myChord) {
    if (chord.show == false) {
      chord.show = true;
    } else {
      chord.show = false;
    }
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

  beautify(array: string[]) {
    let myString: string = '';
    array.forEach((element, idx) => {
      if (idx != 0 && idx != array.length && element != '') {
        myString = myString + ", " + element;
      }
      else {
        myString = myString + element;
      }
    })
    return myString;
  }

  ionViewDidEnter(): void {
    this.translate.setDefaultLang('en');
    let lang = this.cookie.get('language');
    if (lang) {
      this.translate.use(lang);
    }
  }

  ngOnInit() {
    let scale = ["Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "B#"]
    scale.forEach((note, idx) => {
      this.tiles.push({ name: note, color: "light", selected: false })
    });
    console.log(this.tiles);

  }

}
