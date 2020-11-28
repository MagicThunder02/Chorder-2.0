import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MetroData, } from './metronome.model';
import { ShowMetronomePage } from './show/show-metronome.page';



@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.page.html',
  styleUrls: ['./metronome.page.scss'],
})

export class MetronomePage implements OnInit {

  public metroData: MetroData;

  constructor(
    private modalController: ModalController,
  ) {


  }

  fillMetroData() {
    //passes height of header and content
    let content = document.getElementById('content');
    let header = document.getElementById('header');

    console.log('filling metrodata')

    this.metroData = {
      bpm: 120,
      increase: false,
      finalBpm: 160,
      stepBpm: 10,
      canvas: {
        headerWidth: header.clientWidth,
        headerHeight: header.clientHeight,
        contentWidth: content.clientWidth,
        contentHeight: content.clientHeight,
      },

      tracks: [
        {
          beats: 8,
          sound1: 'tick',
          sound2: 'tock',
        },
        {
          beats: 5,
          sound1: 'tick',
          sound2: 'tock',
        },
        {
          beats: 11,
          sound1: 'tick',
          sound2: 'tock',
        },
      ]
    }

    console.table(this.metroData)

  }


  //   public addBeat() {
  //     this.track.beats++;
  //     this.controlValues();
  //     console.log(this.beats);
  // }
  // public removeBeat() {
  //     this.beats--;
  //     this.controlValues();
  //     console.log(this.beats);
  // }


  // controlValues() {
  //   if (this.metronome.bpm < 30) {
  //     this.metronome.bpm = 30;
  //   }
  //   if (this.metronome.bpm > 300) {
  //     this.metronome.bpm = 300;
  //   }
  //   if (this.metronome.beats < 1) {
  //     this.metronome.beats = 1;
  //   }
  //   if (this.metronome.beats > 12) {
  //     this.metronome.beats = 12;
  //   }
  //   if (this.metronome.initialBpm < 30) {
  //     this.metronome.initialBpm = 30;
  //   }
  //   if (this.metronome.initialBpm > 300) {
  //     this.metronome.initialBpm = 300;
  //   }
  //   if (this.metronome.finalBpm < 30) {
  //     this.metronome.finalBpm = 30;
  //   }
  //   if (this.metronome.finalBpm > 300) {
  //     this.metronome.finalBpm = 300;
  //   }
  //   if (this.metronome.stepBpm < 1) {
  //     this.metronome.stepBpm = 1;
  //   }
  //   if (this.metronome.stepBpm > 30) {
  //     this.metronome.stepBpm = 30;
  //   }
  //   if (this.metronome.stepMeasure < 1) {
  //     this.metronome.stepMeasure = 1;
  //   }
  //   if (this.metronome.stepMeasure > 10) {
  //     this.metronome.stepMeasure = 10;
  //   }
  // }
  // setStart() {
  //   this.metronome.bpm = this.metronome.initialBpm;
  // }


  ngOnInit() {
  }

  async showModal() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: ShowMetronomePage,
        componentProps: {
          data: this.metroData
        },
        cssClass: 'fullscreen'
      });

    modal.onDidDismiss().then((result: any) => {
      if (result.data) {
      }
    });

    await modal.present();
  }
}