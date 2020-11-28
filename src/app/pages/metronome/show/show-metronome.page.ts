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
    private applicationRef: ApplicationRef,
  ) {
    this.metronome = { data: {} };
  }

  ionViewDidEnter() {
    let data = this.navParams.get('data');
    this.metronome = new Metronome(data, this.applicationRef);
  }

  ngOnInit() {

  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
