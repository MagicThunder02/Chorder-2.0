import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import * as Tone from "tone";
import { TranslateService } from '@ngx-translate/core';
import { ViewPortService } from 'src/app/services/viewport.service';
import { Subscription } from 'rxjs';

export interface circle {
  color: string;
  index: number;
}

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.page.html',
  styleUrls: ['./metronome.page.scss'],
})

export class MetronomePage implements OnInit {

  private viewPortSubscription: Subscription;
  public orientation: string = '';

  public beats: number[] = [];
  public selectedBeat: number = 4;
  public bpm: number = 120;
  public circles: circle[] = [];
  public myTimer: any;
  public counter: number = 0;
  public color: string = '';
  ;

  constructor(
    private viewPort: ViewPortService,
  ) { }

  ionViewWillEnter() {
  }

  beatChange() {
    this.circles = [];
    console.log(this.selectedBeat);
    for (let i = 0; i < this.selectedBeat; i++) {
      this.circles.push({ color: 'gray', index: i })
    }
  }

  addBpm() {
    if (this.bpm > 30 && this.bpm < 300)
      this.bpm += 1;
  }
  removeBpm() {
    if (this.bpm > 30 && this.bpm < 300)
      this.bpm -= 1;
  }

  tick() {

    if (this.myTimer) {
      clearInterval(this.myTimer);
    }

    this.myTimer = setInterval(() => {
      console.log('tick:', this.counter)
      this.setColor();

      this.counter++;

      if (this.counter > this.selectedBeat - 1) {
        this.counter = 0;
      }

    }, (60 / this.bpm) * 1000);
  }

  setColor() {
    this.circles.forEach(circle => {
      circle.color = 'grey'
    })

    if (this.counter == 0) {
      this.circles[this.counter].color = 'red';
    }
    else {
      this.circles[this.counter].color = 'yellow';
    }

    console.log(this.circles[this.counter].color)
  }

  runMetronome(type) {
    console.log('run', this.bpm, type)
    this.counter = 0;

    switch (type) {
      case "start":
      case "change":
        console.log('start', this.counter)
        this.tick()
        break;

      case "stop":
        console.log('stop');
        clearInterval(this.myTimer);
        this.circles.forEach(circle => {
          circle.color = 'grey'
        })
        this.myTimer = '';
        break;
    }
  }



  ngOnInit() {
    this.viewPortSubscription = this.viewPort.viewPortObserver.subscribe(info => {
      if (info.orientation == 'portrait') {
        this.orientation = 'vertical';

      } else {
        this.orientation = 'horizontal';
      }
      console.log(this.orientation)
    });

    //fill beats array
    for (let i = 1; i <= 12; i++) {
      this.beats.push(i)
    }
    this.beatChange();

  }

}