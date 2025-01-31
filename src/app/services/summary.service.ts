import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Measurement } from './measurement.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private apiUrl = 'http://50.16.250.37:8083/send';

  constructor(private http: HttpClient) {}

  sendSummary(summary: Measurement[]): Observable<any[]> {
    console.log('enviando summary: ', summary);
    return this.http.post<any[]>(this.apiUrl, summary);
  }
}
