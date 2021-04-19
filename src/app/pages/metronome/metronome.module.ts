import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetronomePage } from './metronome.page';
import { RouterModule } from '@angular/router';
import { ShowMetronomePage } from './show/show-metronome.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from 'src/app/app.module';

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
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  // declarations: [MetronomePage, ControlsMetronomePage],
  declarations: [MetronomePage, ShowMetronomePage],
})
export class MetronomePageModule { }
