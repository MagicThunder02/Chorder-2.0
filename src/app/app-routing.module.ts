import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'notefinder',
    loadChildren: () => import('./pages/notefinder/notefinder.module').then(m => m.NotefinderModule)
  },
  {
    path: 'options',
    loadChildren: () => import('./pages/options/options.module').then( m => m.OptionsPageModule)
  },
  {
    path: 'chordmaker',
    loadChildren: () => import('./pages/chordmaker/chordmaker.module').then( m => m.ChordmakerPageModule)
  },
  {
    path: 'instrument',
    loadChildren: () => import('./pages/instrument/instrument.module').then( m => m.InstrumentPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
