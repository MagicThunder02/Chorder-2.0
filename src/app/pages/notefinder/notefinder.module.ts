import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { NotefinderPage } from './notefinder.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../home/home.module';
import { HttpClient } from '@angular/common/http';
import { PipesModule } from '../../pipes/pipes-module/pipes.module';
import { UtilitiesModule } from '../../utilities/utilities.module';
import { HelperComponent } from '../../utilities/helper/helper.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    UtilitiesModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild([
      {
        path: '',
        component: NotefinderPage
      }
    ])
  ],
  declarations: [NotefinderPage],
  entryComponents: [HelperComponent]
})
export class NotefinderModule { }
