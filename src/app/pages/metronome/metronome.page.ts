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

  public metroData: MetroData | any;

  constructor(
    private modalController: ModalController,
  ) {
    this.metroData = {};
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
      ]
    }

    console.table(this.metroData)
  }

  addTrack() {
    this.metroData.tracks.push({
      beats: 8,
      sound1: 'tick',
      sound2: 'tock',
    })
  }

  public addBeat(track) {
    track.beats++;
    this.controlValues();
  }
  public removeBeat(track) {
    track.beats--;
    this.controlValues();
  }


  controlValues() {
    this.metroData.tracks.forEach(track => {
      if (track.beats < 1) {
        track.beats = 1;
      }
      if (track.beats > 12) {
        track.beats = 12;
      }
    });
  }

  ionViewDidEnter() {
    this.fillMetroData();
  }


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