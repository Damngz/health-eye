import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { Patient } from './patient.service';

export interface Measurement {
  patient: Patient;
  heartRate: number;
  systolicPressure: number;
  diastolicPressure: number;
  oxygenSaturation: number;
  bodyTemperature: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class MeasurementService {
  private apiUrl = 'http://localhost:8081/measurements';
  private rabbitMQApiUrl = 'http://localhost:8082/send';

  constructor(private http: HttpClient) {}

  getMeasurements(patientId: string): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  sendMeasurement(measurement: Measurement): Observable<any> {
    const measurementRequest = this.http.post(this.apiUrl, measurement);
    const rabbitMqRequest = this.http.post(this.rabbitMQApiUrl, measurement);

    return forkJoin([measurementRequest, rabbitMqRequest]);
  }
}
