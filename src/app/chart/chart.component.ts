import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, NgApexchartsModule } from 'ng-apexcharts';
import { Measurement } from '../services/measurement.service';

@Component({
  selector: 'app-chart',
  imports: [ NgApexchartsModule ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  @Input() title: string = '';
  @Input() measurements: Measurement[] = [];
  @Input() variable: 'heartRate' | 'oxygenSaturation' | 'bodyTemperature' | 'systolicPressure' = 'heartRate';

  constructor(private cdRef: ChangeDetectorRef) {}

  series: ApexAxisChartSeries = [
    {
      name: "Mediciones",
      data: []
    },
  ];

  chart: ApexChart = {
    type: 'area',
    background: '#ffffff',
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    height: 400
  };

  xaxis: ApexXAxis = {
    categories: [],
  };

  dataLabels: ApexDataLabels = {
    enabled: false,
  };

  colors = [
    '#4D38F5'
  ];

  fill: ApexFill = {
    type: "gradient",
    gradient: {
      shadeIntensity: 0,
      inverseColors: true,
      opacityFrom: 0.8,
      opacityTo: 0.2,
    }
  };

  tooltip: ApexTooltip = {
    marker: {
      show: false
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['measurements'] && this.measurements.length > 0 || changes['variable']) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (this.variable === 'systolicPressure') {
      this.series = [
        {
          name: 'Presión Sistólica',
          data: this.measurements.map(measurement => measurement.systolicPressure).reverse(),
        },
        {
          name: 'Presión Diastólica',
          data: this.measurements.map(measurement => measurement.diastolicPressure).reverse(),
          color: '#344031'
        }
      ];
    } else {
      this.series = [
        {
          name: this.title,
          data: this.measurements.map(measurement => measurement[this.variable]).reverse()
        }
      ];
    }

    this.xaxis = {
      categories: this.measurements.map(measurement => new Date(measurement.timestamp).toLocaleString('es-CL', { timeZone: 'America/Santiago', hour12: false })).reverse()
    };

    this.cdRef.detectChanges();
  }
}
