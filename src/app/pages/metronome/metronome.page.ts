import { Component, OnInit } from '@angular/core';
import * as Tone from "tone";

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.page.html',
  styleUrls: ['./metronome.page.scss'],
})
export class MetronomePage implements OnInit {

  //create a synth and connect it to the master output (your speakers)
  public synth: any;
  private tempo: number = 120;
  private pulse: number = 0;
  public metre: string = "4/4";
  private metreArray: string[] = ["C4", "C4", "C4", "C5"];

  constructor() {

  }

  public play(): void {
    Tone.Transport.stop();
    Tone.Transport.start();
  }

  public updateTempo(bpm: number): void {
    Tone.Transport.bpm.value = this.tempo;
  }

  public stop(): void {
    Tone.Transport.stop();
  }

  private readMetre() {
    this.metreArray = [];
    this.metreArray.push("C5");
    for (let i = 0; i < (+this.metre[0] - 1); i++) {
      this.metreArray.push("C4");
    }
  }

  public plusBpm() {
    if (this.tempo < 300) {
      this.tempo += 1;
    }
  }

  public minusBpm() {
    if (this.tempo > 30) {
      this.tempo -= 1;
    }
  }


  ngOnInit() {
    this.synth = new Tone.Synth().toMaster();

    this.readMetre()
    Tone.Transport.scheduleRepeat(time => {

      this.synth.triggerAttackRelease(this.metreArray[this.pulse], "16n", time);

      this.pulse += 1;


      if (this.pulse >= this.metreArray.length) {
        this.pulse = 0;
      }


    }, "4n");

    //default tempo
    Tone.Transport.bpm.value = this.tempo;
  }

}
