import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home-outline'
    },
    {
      title: 'ChordMaker',
      url: '/chordmaker',
      icon: 'hammer-outline'
    },
    {
      title: 'Notefinder',
      url: '/notefinder',
      icon: 'search-outline'
    },
    {
      title: 'home.metronome',
      url: '/metronome',
      icon: 'stopwatch-outline'
    },
    // {
    //   title: 'home.instrument',
    //   url: '/instrument',
    //   icon: 'musical-notes-outline'
    // },
    {
      title: 'home.options',
      url: '/options',
      icon: 'settings-outline'
    }
  ];

  constructor() { }
}
