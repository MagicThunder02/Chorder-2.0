import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-infoModal',
  templateUrl: './infoModal.component.html',
  styleUrls: ['./infoModal.component.scss'],
})
export class InfoModalComponent {

  public pageName: string = "";
  public pageText: string = "";

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public translate: TranslateService,
    public global: GlobalService,
  ) {
  }

  ionViewDidEnter() {
  }

  ngOnInit() {


    this.pageName = this.navParams.get('pageName');
    console.log(this.pageName)
  }

  public capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }
}