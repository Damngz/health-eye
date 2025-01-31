import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from '../chart/chart.component';
import { Patient, PatientService } from '../services/patient.service';
import { Measurement, MeasurementService } from '../services/measurement.service';
import { SummaryService } from '../services/summary.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-monitoring',
  imports: [ CommonModule, ChartComponent, NgApexchartsModule, FormsModule ],
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.css'
})
export class MonitoringComponent {
  patient!: Patient;
  measurements: Measurement[] = [];
  chartTitle = 'Frecuencia Cardíaca';
  chartVariable: 'heartRate' | 'oxygenSaturation' | 'bodyTemperature' | 'systolicPressure' = 'heartRate';
  newMeasurement = {
    heartRate: 0,
    oxygenSaturation: 0,
    systolicPressure: 0,
    diastolicPressure: 0,
    bodyTemperature: 0,
  };
  private autoSendSubscription!: Subscription;

  sendMeasurement(patient: Patient) {
    const newMeasurement = { ...this.newMeasurement, timestamp: new Date().toISOString(), patient };
    this.measurementService.sendMeasurement(newMeasurement).subscribe({
      next: () => {
        this.measurements = [newMeasurement, ...this.measurements];
        console.log('Medición enviada correctamente a ambos servicios');
      },
      error: (err) => console.error('Error enviando la medición:', err),
    });
    this.newMeasurement = { heartRate: 0, oxygenSaturation: 0, systolicPressure: 0, diastolicPressure: 0, bodyTemperature: 0 };
  }

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private measurementService: MeasurementService,
    private summaryService: SummaryService
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('patientId');
    console.log(patientId);
    if (patientId) {
      this.loadPatient(patientId);
      this.loadMeasurements(patientId);
    }

    this.autoSendSubscription = interval(600000).subscribe(() => {
      this.sendLastFiveMeasurements();
    });
  }

  private loadPatient(patientId: string): void {
    this.patientService.getPatient(patientId).subscribe({
      next: (data) => (this.patient = { age: this.calculateAge(data.birthDate), ...data}),
      error: (err) => console.error('Error fetching patient details:', err),
    });
  }

  private sendLastFiveMeasurements() {
    if (this.measurements.length > 0) {
      const lastFive = this.measurements.slice(0, 5);
      this.summaryService.sendSummary(lastFive).subscribe({
        next: () => console.log('Últimos 5 measurements enviados correctamente a SummaryService.'),
        error: (err) => console.error('Error enviando los últimos 5 measurements:', err),
      });
    }
  }

  private loadMeasurements(patientId: string): void {
    this.measurementService.getMeasurements(patientId).subscribe({
      next: (data) => (this.measurements = data),
      error: (err) => console.error('Error fetching measurements:', err),
    });
  }

  onMetricClick(metric: 'heartRate' | 'oxygenSaturation' | 'systolicPressure' | 'bodyTemperature') {
    this.chartVariable = metric;
    this.chartTitle = this.getTitleForMetric(metric);
  }

  getTitleForMetric(metric: string): string {
    switch (metric) {
      case 'heartRate': return 'Frecuencia Cardíaca';
      case 'oxygenSaturation': return 'Saturación de Oxígeno';
      case 'systolicPressure': return 'Presión Arterial';
      case 'bodyTemperature': return 'Temperatura Corporal';
      default: return '';
    }
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
