import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { CommonModule } from '@angular/common';
import { Patient, PatientService } from '../services/patient.service';

@Component({
  selector: 'app-alerts',
  imports: [ CommonModule ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  alerts: any[] = [];
  patientId!: number;
  patient!: Patient;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService, 
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('patientId');
      if (id) {
        this.patientId = +id;
        this.loadPatient(id);
        this.loadAlerts();
      }
    });
  }

  loadAlerts(): void {
    this.alertService.getAlertsByPatient(this.patientId).subscribe({
      next: (data) => {
        this.alerts = data;
      },
      error: (err) => {
        console.error('Error al obtener alertas:', err);
      }
    });
  }

  private loadPatient(patientId: string): void {
    this.patientService.getPatient(patientId).subscribe({
      next: (data) => (this.patient = { age: this.calculateAge(data.birthDate), ...data}),
      error: (err) => console.error('Error fetching patient details:', err),
    });
  }

  calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}
