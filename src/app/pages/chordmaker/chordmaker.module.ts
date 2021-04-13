import { NgModule, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HelperComponent } from '../../utilities/helper/helper.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../home/home.module';
import { HttpClient } from '@angular/common/http';
import { PipesModule } from '../../pipes/pipes-module/pipes.module';
import { HelperModule } from '../../utilities/utilities.module';
import { SimpleTimer } from 'ng2-simple-timer';
import { RouterModule } from '@angular/router';
import { ChordmakerPage } from './chordmaker.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChordmakerPage
      }
    ]),
    PipesModule,
    HelperModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [ChordmakerPage],
  entryComponents: [HelperComponent],
  providers: [SimpleTimer]
})
export class ChordmakerPageModule { }
