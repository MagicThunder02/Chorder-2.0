import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chord } from "@tonaljs/tonal";
import * as Tone from 'tone';
import { GlobalService } from 'src/app/services/global.service';
import { MusicNotationPipe } from 'src/app/pipes/music-notation.pipe';
import { ModalController } from '@ionic/angular';
import { InfoModalComponent } from '../infoModal/infoModal.component';
// import SampleLibrary from '../notefinder/inst-loader.js'

export interface Tile {
  name?: string;
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
  intervals?: { symbols: string[], quality: string[], numbers: String[] };
  extensions?: { open: boolean, values: string[] };
  reductions?: { open: boolean, values: string[] };
  notes?: string[];
  show?: boolean;
  empty?: boolean;
}

@Component({
  selector: 'app-notefinder',
  templateUrl: 'notefinder.page.html',
  styleUrls: ['notefinder.page.scss']
})

export class NotefinderPage implements OnInit {
  private musicNotationPipe = new MusicNotationPipe(this.global);

  public scale: string[] = [];
  public typesTiles: Tile[] = [];
  public gradesTiles: Tile[] = [];
  public key: string = '';
  private type: string = '';
  private grade: string = '';
  public chords: myChord[] = [];
  public filteredChords: myChord[] = [];
  public status: string = "";
  private serVal: string = "";

  private synth;

  constructor(
    private translate: TranslateService, private global: GlobalService, private modalCtrl: ModalController) {

    this.synth = new Tone.Sampler({
      urls: {
        A2: "pianoA2.wav",
      },
      baseUrl: "assets/instruments/",

    }).toDestination();
  }

  ionViewDidEnter(): void {
    this.selectInstrument()
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

  //fist byte = key
  //second byte = type
  //third byte = grade
  checkStatus() {
    this.status = "";

    if (this.key == " " || this.key == "") {
      this.status = this.status + "0";
    }
    else {
      this.status = this.status + "1";
    }

    if (!this.typesTiles[0].selected && !this.typesTiles[1].selected &&
      !this.typesTiles[2].selected && !this.typesTiles[3].selected) {
      this.status = this.status + "0";
    }
    else {
      this.status = this.status + "1";
    }

    if (!this.gradesTiles[0].selected && !this.gradesTiles[1].selected &&
      !this.gradesTiles[2].selected && !this.gradesTiles[3].selected && !this.gradesTiles[4].selected) {
      this.status = this.status + "0";
    }
    else {
      this.status = this.status + "1";
    }

    console.log(this.status)
  }

  pushAll() {
    this.chords = [];
    let chordName = this.key.trim() + " major"
    this.pushExtendedChords(chordName);
    chordName = this.key.trim() + "min"
    this.pushExtendedChords(chordName);
    chordName = this.key.trim() + "dim"
    this.pushExtendedChords(chordName);
    chordName = this.key.trim() + "aug"
    this.pushExtendedChords(chordName);
  }

  intervalToNumber(intervals: string[]) {
    return intervals.map(interval => {
      let number = "";

      switch (interval[0]) {
        case "1":
          number = "unison"
          break;
        case "2":
          number = "second"
          break;
        case "3":
          number = "third"
          break;
        case "4":
          number = "fourth"
          break;
        case "5":
          number = "fifth"
          break;
        case "6":
          number = "sixth"
          break;
        case "7":
          number = "seventh"
          break;
        case "8":
          number = "seventh"
          break;
        case "9":
          number = "ninth"
          break;
        case "11":
          number = "eleventh"
          break;
        case "13":
          number = "thirteenth"
          break;
      }

      return number;
    })
  }

  intervalToQuality(intervals: string[]) {
    return intervals.map(interval => {
      let quality = "";

      switch (interval[1]) {
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
    let returnChord: myChord = {};
    console.log("c", chordName, Chord.get("C major"))
    let tmpChord = Chord.get(chordName);

    returnChord.symbol = tmpChord.symbol;
    returnChord.name = tmpChord.name.split(" ");
    returnChord.tonic = tmpChord.tonic;
    returnChord.root = tmpChord.root;
    returnChord.intervals = {
      symbols: tmpChord.intervals,
      quality: this.intervalToQuality(tmpChord.intervals),
      numbers: this.intervalToNumber(tmpChord.intervals)
    };
    returnChord.aliases = tmpChord.aliases;
    returnChord.type = tmpChord.type;
    returnChord.notes = tmpChord.notes;
    returnChord.extensions = { open: false, values: Chord.extended(tmpChord.symbol) };
    returnChord.reductions = { open: false, values: Chord.reduced(tmpChord.symbol) };
    returnChord.empty = tmpChord.empty;
    return returnChord;
  }


  pushExtendedChords(chordName) {
    let chordNameArray = Chord.extended(chordName);
    console.log(chordName, chordNameArray)

    this.chords.push(this.assembleChord(chordName))
    chordNameArray.forEach(chord => {
      this.chords.push(this.assembleChord(chord))
    })
  }

  selectTypeTile(tile: Tile) {
    this.type = tile.name;
    this.toggleTypeTile(tile);
    this.colorTiles()
    this.searchChord();
    console.log(this.type)
  }

  selectGradeTile(tile: Tile) {
    this.grade = tile.name;
    this.toggleGradeTile(tile);
    this.colorTiles()
    this.searchChord();
    console.log(this.type)
  }

  //select or deselect a tile
  toggleTypeTile(tile: Tile) {
    if (tile.selected == false) {
      this.typesTiles.forEach(tile => {
        tile.selected = false;
      })
      tile.selected = true;
    } else {
      tile.selected = false;
    }
  }

  toggleGradeTile(tile: Tile) {

    if (tile.selected == false) {
      this.gradesTiles.forEach(tile => {
        tile.selected = false;
      })
      tile.selected = true;
    } else {
      tile.selected = false;
    }
  }

  //color the tiles if selected
  colorTiles() {
    this.typesTiles.forEach(tile => {
      if (tile.selected) {
        tile.color = "secondary"
      }
      else {
        tile.color = "light"
      }
    })
    this.gradesTiles.forEach(tile => {
      if (tile.selected) {
        tile.color = "secondary"
      }
      else {
        tile.color = "light"
      }
    })
  }

  gradeFilter() {
    //if the chord doesnt't contain the grade it is removed
    if (this.status[2] == "1") {

      let tmp: myChord[] = [];
      this.chords.forEach(chord => {
        if (chord.symbol.includes(this.grade)) {
          tmp.push(chord);
        }
      });

      this.chords = tmp;
    }
  }

  searchChord() {
    this.checkStatus();
    let chordName = this.key.trim() + this.type;
    this.chords = [];
    switch (this.status) {
      case "000":
        if (this.key == '') {
          this.chords = [];
          this.filteredChords = [];
        }
        break;

      case "010":
      case "110":
      case "011":
      case "111":
        this.pushExtendedChords(chordName);
        this.gradeFilter();
        this.getChords();
        break;

      default:
        console.log("default")
        this.pushAll();
        this.gradeFilter();
        this.getChords();
        break;

    }

    console.log(chordName, this.chords)
  }

  getChords(ev?: any) {

    if (ev) {
      this.serVal = ev.target.value;
    }

    let tmp: any[] = [];

    this.chords.forEach(chord => {
      if (chord.symbol.toLowerCase().trim().includes(this.serVal)) {

        tmp.push(chord);
      }
      else {
        chord.aliases.forEach(alias => {
          if (alias.toLowerCase().trim().includes(this.serVal)) {

            tmp.push(chord);
          }
        });
      }
    })

    this.filteredChords = tmp;
    console.log(this.serVal, this.filteredChords)
  }

  toggleCard(chord: myChord) {
    if (chord.show) {
      chord.show = false;
    } else {
      chord.show = true;
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
    console.log(notes);

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

  beautify(array: string[], pipe: boolean = true) {
    let myString: string = '';

    switch (pipe) {

      case true:
        if (array) {
          array.forEach((element, idx) => {
            if (idx != 0 && idx != array.length) {
              if (element != "") {
                myString = myString + ", " + this.musicNotationPipe.transform(element);
              }
            }
            else {
              if (element != "") {
                myString = myString + this.musicNotationPipe.transform(element);
              }
            }

          })
          if (myString != "") {
            return myString;
          }
        }
        break;

      case false: array.forEach((element, idx) => {
        if (idx != 0 && idx != array.length) {
          if (element != "") {
            myString = myString + ", " + element;
          }
        }
        else {
          if (element != "") {
            myString = myString + element
          }
        }

      })
        if (myString != "") {
          return myString;
        }
    }
  }

  ngOnInit() {
    this.scale = ["", "Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "B#"]
    let types = ["major", "min", "dim", "aug"];
    let grades = ["5", "7", "9", "11", "13"]

    types.forEach(name => {
      this.typesTiles.push({ name: name, color: "light", selected: false })
    });
    grades.forEach(name => {
      this.gradesTiles.push({ name: name, color: "light", selected: false })
    });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: InfoModalComponent,
      componentProps: {
        pageName: "notefinder",
      },
      cssClass: 'fullscreen'
    });
    await modal.present();
  }
}
