import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetronomePageRoutingModule } from './metronome-routing.module';

import { MetronomePage } from './metronome.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetronomePageRoutingModule
  ],
  declarations: [MetronomePage]
})
export class MetronomePageModule {}
