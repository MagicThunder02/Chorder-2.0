import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HelperComponent } from './helper.component';
import { PipesModule } from '../pipes/pipes-module/pipes.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../home/home.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [HelperComponent],
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
    HelperComponent
  ]
})
export class HelperModule { }
