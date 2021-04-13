import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MetroData, Metronome, } from './metronome.model';
import { ShowMetronomePage } from './show/show-metronome.page';
import * as Tone from "tone";


@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.page.html',
  styleUrls: ['./metronome.page.scss'],
})

export class MetronomePage implements OnInit {

  public metronome: Metronome
  public toggled: boolean = false;
  public sliderValue: number = 120;
  public increase: boolean = false;

  constructor(
    private modalController: ModalController,
    private applicationRef: ApplicationRef,
  ) {

  }

  public toggleOptions() {
    if (this.toggled) {
      this.toggled = false;
    }
    else {
      this.toggled = true;
    }
  }

  ionViewDidEnter() {
    this.metronome = new Metronome(this.applicationRef, document);
  }

  ngOnInit() {

  }

  async showModal() {
    //audiocontext resume
    Tone.start();


    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: ShowMetronomePage,
        componentProps: {
          metronome: this.metronome,
          document: document,
        },
        cssClass: 'fullscreen'
      });

    modal.onDidDismiss().then((result: any) => { });

    await modal.present();
  }
}