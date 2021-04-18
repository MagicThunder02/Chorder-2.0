import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public notation: string = 'american';
  public language: string = 'en';

  constructor() { }
}
