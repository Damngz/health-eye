import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  phone: string;
  address: string;
  email: string;
  img: string;
  height: number;
  weight: number;
  medicalRecord: string;
  age?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:8081/patients';

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(this.apiUrl + `/${id}`);
  }
}
