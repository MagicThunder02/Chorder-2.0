import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public notation: string = 'american';
  public language: string = 'en';
  public instrument: string = 'piano';

  constructor() { }
}
