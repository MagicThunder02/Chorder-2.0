import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Metronome, } from './metronome.model';
import { ShowMetronomePage } from './show/show-metronome.page';
import * as Tone from "tone";
import { InfoModalComponent } from '../infoModal/infoModal.component';


@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.page.html',
  styleUrls: ['./metronome.page.scss'],
})

export class MetronomePage implements OnInit {

  public metronome: Metronome
  public sliderValue: number = 120;
  public increase: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private applicationRef: ApplicationRef,
  ) {

  }

  ionViewDidEnter() {
    this.metronome = new Metronome(this.applicationRef, document);
  }

  ngOnInit() {

  }

  async openMetroModal() {
    //audiocontext resume
    Tone.start();

    const modal: HTMLIonModalElement = await this.modalCtrl.create({
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

  async openModal() {
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: InfoModalComponent,
      componentProps: {
        pageName: "metronome",
      },
      cssClass: 'fullscreen'
    });
    await modal.present();
  }
}