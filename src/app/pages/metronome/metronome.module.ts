import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetronomePage } from './metronome.page';
import { RouterModule } from '@angular/router';
import { ShowMetronomePage } from './show/show-metronome.page';
import { ControlsMetronomePage } from './controls-metronome/controls-metronome.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    RouterModule.forChild([
      {
        path: '',
        component: MetronomePage
      },
      {
        path: '/show',
        component: ShowMetronomePage
      },
      {
        path: '/controls',
        component: ControlsMetronomePage
      }
    ]),
  ],
  // declarations: [MetronomePage, ControlsMetronomePage],
  declarations: [MetronomePage, ShowMetronomePage, ControlsMetronomePage],
})
export class MetronomePageModule { }
