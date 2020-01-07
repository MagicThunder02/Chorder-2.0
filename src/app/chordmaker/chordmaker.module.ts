import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChordmakerPageRoutingModule } from './chordmaker-routing.module';
import { ChordmakerPage } from './chordmaker.page';
import { HelperComponent } from '../helper/helper.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../home/home.module';
import { HttpClient } from '@angular/common/http';
import { PipesModule } from '../pipes/pipes-module/pipes.module';
import { HelperModule } from '../helper/helper.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    HelperModule,
    ChordmakerPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [ChordmakerPage],
  entryComponents: [HelperComponent]
})
export class ChordmakerPageModule {}
