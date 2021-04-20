import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public darkmode: boolean = false;
  public notation: string = 'american';
  public language: string = 'en';
  public instrument: string = 'piano';

  constructor() { }
}
