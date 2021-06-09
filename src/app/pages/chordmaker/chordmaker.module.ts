import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../home/home.module';
import { HttpClient } from '@angular/common/http';
import { PipesModule } from '../../pipes/pipes-module/pipes.module';
import { RouterModule } from '@angular/router';
import { ChordmakerPage } from './chordmaker.page';
import { InfoModalComponent } from '../infoModal/infoModal.component';
import { MyComponentsModule } from 'src/app/components/mycomponents.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChordmakerPage
      }
    ]),
    PipesModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [ChordmakerPage, InfoModalComponent],
  providers: [NavParams]
})
export class ChordmakerPageModule { }
