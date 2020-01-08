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
      icon: 'musical-notes'
    },
    {
      title: 'Notefinder',
      url: '/notefinder',
      icon: 'list'
    },
    {
      title: 'home.options',
      url: '/options',
      icon: 'cog'
    }
  ];
  
  constructor() { }
}
