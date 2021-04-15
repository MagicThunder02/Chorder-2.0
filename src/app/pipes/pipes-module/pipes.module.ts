import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicNotationPipe } from '../music-notation.pipe';

@NgModule({
  declarations: [MusicNotationPipe],
  imports: [
    CommonModule
  ],
  exports: [
    MusicNotationPipe
  ]
})
export class PipesModule { }
