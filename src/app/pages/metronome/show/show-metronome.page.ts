import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Metronome } from '../metronome.model';



@Component({
  selector: 'app-show-metronome',
  templateUrl: './show-metronome.page.html',
  styleUrls: ['./show-metronome.page.scss'],
})
export class ShowMetronomePage implements OnInit {

  public metronome: Metronome | any;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
  ) {
  }

  ionViewDidEnter() {

    this.metronome = this.navParams.get('metronome');

  }

  printMousePos(event) {
    console.log("clientX: " + event.clientX + " - clientY: " + event.clientY)

  }

  ngOnInit() {

  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
