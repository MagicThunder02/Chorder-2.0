import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss'],
})
export class HelperComponent implements OnInit {

  public contextTitle:string = '';
  public contextContent:string = '';

  constructor(private navParams: NavParams) { }

  ngOnInit() {
    this.contextTitle = this.navParams.data.contextTitle;
    this.contextContent = this.navParams.data.contextContent; 
  }

}
