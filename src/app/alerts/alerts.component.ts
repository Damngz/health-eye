import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  imports: [ CommonModule ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  alerts: any[] = [];
  patientId!: number;

  constructor(private route: ActivatedRoute, private alertService: AlertService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('patientId');
      if (id) {
        this.patientId = +id;
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
}
