import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { myChord } from 'src/app/pages/notefinder/notefinder.page';
import { GlobalService } from 'src/app/services/global.service';
import * as Tone from 'tone';

@Component({
  selector: 'app-chord',
  templateUrl: './chord.component.html',
  styleUrls: ['./chord.component.scss'],
})
export class ChordComponent implements OnInit {

  @Input() chord: myChord;
  @Output() chordLink = new EventEmitter<string>();

  private synth;

  constructor(private global: GlobalService) {
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

  toggleCard(chord: myChord) {
    if (chord.show) {
      chord.show = false;
    } else {
      chord.show = true;
    }
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

  inputChord(chordName) {
    this.chordLink.emit(chordName);
  }

  ionViewDidEnter(): void {
    this.selectInstrument()
  }

  ngOnInit() { }

}
