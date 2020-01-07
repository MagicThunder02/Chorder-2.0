import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicNotationPipe } from '../music-notation.pipe';
import { MusicSymbolsPipe } from '../music-symbols.pipe';



@NgModule({
  declarations: [MusicNotationPipe, MusicSymbolsPipe],
  imports: [
    CommonModule
  ],
  exports: [
    MusicNotationPipe, MusicSymbolsPipe
  ]
})
export class PipesModule { }
