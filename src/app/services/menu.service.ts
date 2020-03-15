import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'ChordMaker',
      url: '/chordmaker',
      icon: 'recording'
    },
    {
      title: 'Notefinder',
      url: '/notefinder',
      icon: 'search'
    },
    {
      title: 'home.metronome',
      url: '/metronome',
      icon: 'stopwatch'
    },
    {
      title: 'home.instrument',
      url: '/instrument',
      icon: 'musical-notes'
    },
    {
      title: 'home.options',
      url: '/options',
      icon: 'cog'
    }
  ];

  constructor() { }
}
