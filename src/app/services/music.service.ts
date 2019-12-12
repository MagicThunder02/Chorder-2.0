import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Music } from './music.model';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private dataUrl: string = 'assets/database.json'

  constructor(private http: HttpClient) {   }

  public getData():Observable<Music> {
    return this.http.get<Music>(this.dataUrl)
  }
}
