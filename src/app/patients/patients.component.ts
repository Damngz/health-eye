import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Patient, PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patients',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  filterText: string = '';

  constructor(private patientService: PatientService){}

  ngOnInit() {
    this.patientService.getPatients().subscribe((data) => {
      this.patients = data.map((patient) => ({
        ...patient,
        age: this.calculateAge(patient.birthDate)
      }));
      this.filteredPatients = [...this.patients];
    })
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

  onFilterChange() {
    this.filteredPatients = this.patients.filter((patient) => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      return fullName.includes(this.filterText.toLowerCase());
    });
  }
}
