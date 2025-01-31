import { Routes } from "@angular/router";
import { AuthGuard } from "./auth.guard";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(load => load.HomeComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(load => load.HomeComponent)
  },
  {
    path: 'patients',
    loadComponent: () => import('./patients/patients.component').then(load => load.PatientsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'monitoring/:patientId',
    loadComponent: () => import('./monitoring/monitoring.component').then(load => load.MonitoringComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'monitoring/:patientId/alerts',
    loadComponent: () => import('./alerts/alerts.component').then(load => load.AlertsComponent),
    canActivate: [AuthGuard]
  }
]
