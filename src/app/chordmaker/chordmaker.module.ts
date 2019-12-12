import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChordmakerPageRoutingModule } from './chordmaker-routing.module';

import { ChordmakerPage } from './chordmaker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChordmakerPageRoutingModule 
  ],
  declarations: [ChordmakerPage]
})
export class ChordmakerPageModule {}
