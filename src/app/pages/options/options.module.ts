import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptionsPageRoutingModule } from './options-routing.module';

import { OptionsPage } from './options.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { HttpLoaderFactory } from 'src/app/app.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    OptionsPageRoutingModule
  ],
  declarations: [OptionsPage],
  providers: [CookieService],
})
export class OptionsPageModule { }
