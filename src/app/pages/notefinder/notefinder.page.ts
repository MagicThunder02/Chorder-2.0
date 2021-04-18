import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Chord, ChordType } from "@tonaljs/tonal";
import * as Tone from 'tone';
// import SampleLibrary from '../notefinder/inst-loader.js'

export interface Tile {
  name?: string;
  color: string;
  selected?: boolean;
}

export interface myChord {
  chord: any;
  show?: boolean;
}

@Component({
  selector: 'app-notefinder',
  templateUrl: 'notefinder.page.html',
  styleUrls: ['notefinder.page.scss']
})

export class NotefinderPage implements OnInit {

  public instruments: string[] = ["Cello", "Contrabass", "Guitar-Nylon", "Guitar-Acoustic ", "Harmonium", "Piano", "Saxophone"];
  public myInstrument: string = '';

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
  // private synth = SampleLibrary.load({
  //   instruments: "piano"
  // }).toDestination();
  // private synth = new Tone.PolySynth().toDestination(); 

  private synth;

  constructor(
    private translate: TranslateService, private cookie: CookieService) {

    this.translate.setDefaultLang('en');
    let lang = this.cookie.get('language');
    if (lang) {
      this.translate.use(lang);
    }

    this.synth = new Tone.Sampler({
      urls: {
        A2: "pianoA2.wav",
      },
      baseUrl: "assets/instruments/",

    }).toDestination();
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
    let chordName = this.key.trim() + "major"
    this.pushExtendedChords(chordName);
    chordName = this.key.trim() + "min"
    this.pushExtendedChords(chordName);
    chordName = this.key.trim() + "dim"
    this.pushExtendedChords(chordName);
    chordName = this.key.trim() + "aug"
    this.pushExtendedChords(chordName);
  }

  pushExtendedChords(chordName) {
    let chordNameArray = Chord.extended(chordName);
    this.chords.push({ chord: Chord.get(chordName), show: false })
    chordNameArray.forEach(chord => {
      this.chords.push({ chord: Chord.get(chord), show: false })
    })
  }

  selectTypeTile(tile: Tile) {
    this.type = this.convertName(tile.name);
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

  convertName(name) {
    // console.log(name)
    switch (name) {
      case "Major": return "major"
      case "Minor": return "min"
      case "Diminished": return "dim"
      case "Augmented": return "aug"
      default:
        console.log("type error: ", name);
        return name;
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
        if (chord.chord.symbol.includes(this.grade)) {
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
      if (chord.chord.symbol.toLowerCase().trim().includes(this.serVal)) {

        tmp.push(chord);
      }
    })

    this.filteredChords = tmp;
    console.log(this.serVal, this.filteredChords)
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

    let notes = chord.chord.notes.map(function (note, idx) {

      if (note.includes("##")) {
        let idx = scale.indexOf(note.slice(0, -1));
        note = scale[(idx + 2) % scale.length];
        // console.log(idx, note, scale[idx % scale.length], scale[(idx + 2) % scale.length])
      }

      if (note.includes("bb")) {
        let idx = scale.indexOf(note);
        note = scale[(idx - 2) % scale.length];
      }

      if (parseInt(chord.chord.intervals[idx], 10) <= 7) {
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

  ngOnInit() {
    this.scale = ["", "Cb", "C", "C#", "Db", "D", "D#", "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "B#"]
    let types = ["Major", "Minor", "Diminished", "Augmented"];
    let grades = ["5", "7", "9", "11", "13"]

    types.forEach(name => {
      this.typesTiles.push({ name: name, color: "light", selected: false })
    });
    grades.forEach(name => {
      this.gradesTiles.push({ name: name, color: "light", selected: false })
    });
  }
}
