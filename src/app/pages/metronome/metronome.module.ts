import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetronomePage } from './metronome.page';
import { RouterModule } from '@angular/router';
import { ShowMetronomePage } from './show/show-metronome.page';

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
    ]),
  ],
  // declarations: [MetronomePage, ControlsMetronomePage],
  declarations: [MetronomePage, ShowMetronomePage],
})
export class MetronomePageModule { }
