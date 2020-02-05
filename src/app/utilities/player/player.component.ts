import { Component, OnInit, Input } from '@angular/core';
import { MusicService } from 'src/app/services/music.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { SimpleTimer } from 'ng2-simple-timer';
import { ChordComponent } from 'src/app/services/music.model';
import * as Tone from "tone";
import { InstrumentsService } from '../../services/instruments.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {


  @Input() components: ChordComponent[];

  public enableChordButton: boolean = true;
  public enableArpButton: boolean = true;

  private sampler: any;
  private sequence: any;
  private start = 0;

  private notes = [];

  private myinstruments: any;

  constructor(private musicService: MusicService, private instruments: InstrumentsService, private translate: TranslateService,
    private cookie: CookieService, private st: SimpleTimer) {
  }

  private disableButtons(name: string): void {
    //disabilita i bottoni mentre l'accordo suona
    this.enableArpButton = false;
    this.enableChordButton = false;


    switch (name) {
      case 'chord':

        setTimeout(() => {
          this.enableChordButton = true;
          this.enableArpButton = true;
        }, 3000);

        break;

      case 'arp':

        setTimeout(() => {
          this.enableChordButton = true;
          this.enableArpButton = true;
        }, this.notes.length * 1000);
        break;
    }


    // Tone.Transport.loop = false;

  }


  private loadSamples(instrument) {


    // console.log("loading: %o", instrument);
    this.sampler = new Tone.Sampler();
    instrument.notes.forEach(note => {
      this.sampler.add(note.name.replace('s', '#'), `assets/instruments/${instrument.name}/${note.name}.mp3`);
    })

    this.sampler.toMaster();


  }

  public convertString(value: string): string {

    //traduce da europea a americana 
    value = value.toString().replace('Do', 'C');
    value = value.toString().replace('Re', 'D');
    value = value.toString().replace('Mi', 'E');
    value = value.toString().replace('Fa', 'F');
    value = value.toString().replace('Sol', 'G');
    value = value.toString().replace('La', 'A');
    value = value.toString().replace('Si', 'B');
    // console.log(value)

    //da bemolle a diesis
    value = value.toString().replace('Cb', 'B');
    value = value.toString().replace('Db', 'C#');
    value = value.toString().replace('Eb', 'D#');
    value = value.toString().replace('Fb', 'E');
    value = value.toString().replace('Gb', 'F#');
    value = value.toString().replace('Ab', 'G#');
    value = value.toString().replace('Bb', 'A#');
    return value;
  }

  private sorter(notes): string[] {
    let firstOctave = [];
    let secondOctave = [];
    let finalArray = [];

    // separo le note senza da quelle con l'ottava (impostata a 3 di base)
    console.table(notes)
    notes.forEach(note => {
      //se l'ultimo carattere è 3
      if (note[note.length - 1] == '3') {
        firstOctave.push(note);
      }
      if (note[note.length - 1] >= '4') {
        secondOctave.push(note);
      }
    })

    //faccio sort su entrambi gli array 

    firstOctave.sort();
    //finchè è presente una A o B la sposto al fondo
    while (firstOctave[0].includes('A') || firstOctave[0].includes('B')) {
      firstOctave.push(firstOctave[0])
      firstOctave.shift();
    }
    console.table('f', firstOctave);

    secondOctave.sort();
    if (secondOctave[0]) {
      while (secondOctave[0].includes('A') || secondOctave[0].includes('B')) {
        secondOctave.push(secondOctave[0])
        secondOctave.shift();
      }
    }
    console.table('s', secondOctave);

    //aggiungo ogni nota nell'array finale
    firstOctave.forEach(note => {
      finalArray.push(note)
    })
    secondOctave.forEach(note => {
      finalArray.push(note)
    })
    console.log('finalarray', finalArray)
    return finalArray;
  }

  private prepareNotes() {
    this.notes = [];
    let num = 3;

    this.components.forEach(comp => {

      if (comp.selected) {
        //se l'ottava è selezionata suona l'ottava superiore
        let octave: number = num;
        if (comp.octaveSelected) {
          octave = num + 1;
        }
        else {
          octave = num;
        }
        //compongo il nome della nota
        let name = `${this.convertString(comp.selected)}${octave}`;
        this.notes.push(name);
      }
    })

    this.notes = this.sorter(this.notes);
  }

  public playChord() {

    this.disableButtons('chord');
    this.prepareNotes();

    this.sampler.triggerAttackRelease(this.notes, 3);
  }


  public playArp() {
    //arpeggia un accordo con 1 secondo di distanza

    this.disableButtons('arp');
    this.prepareNotes();

    this.sequence = new Tone.Sequence((time, note) => {

      this.sampler.triggerAttackRelease(note, 1, time);

      let stopat = this.start + (this.notes.length - 1) - 0.001 //millesimo di secondo per l'arrotondamento
      console.table(time, stopat, this.notes.length)

      if (time >= stopat) {
        //non suona più 

        // console.log('stop', time)
        Tone.Transport.stop();
        this.sequence.removeAll();

        Tone.Transport.seconds = 0;
      }
    },
      this.notes,
      1
    );

    this.sequence.start();

    this.start = Tone.Transport.now();
    // console.log('s', this.start)
    Tone.Transport.start();
  }

  ngOnInit(): void {
    this.instruments.getData().subscribe((res) => {
      this.myinstruments = res;
      console.log(this.myinstruments);
      this.loadSamples(this.myinstruments.instruments['guitar-acoustic']);
    })

  }
}
