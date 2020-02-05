import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstrumentsService {
  private dataUrl: string = 'assets/instruments.json'

  constructor(private http: HttpClient) {   }

  public getData():Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }
}
