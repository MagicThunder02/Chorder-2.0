import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HelperComponent } from './helper/helper.component';
import { PipesModule } from '../pipes/pipes-module/pipes.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../pages/home/home.module';
import { HttpClient } from '@angular/common/http';
import { PlayerComponent } from './player/player.component';

@NgModule({
  declarations: [HelperComponent, PlayerComponent],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    HelperComponent, PlayerComponent
  ]
})
export class HelperModule { }
