import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChordmakerPage } from './chordmaker.page';

const routes: Routes = [
  {
    path: '',
    component: ChordmakerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChordmakerPageRoutingModule {}
