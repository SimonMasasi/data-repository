// donut-chart.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {
  @Input() datasetSummary!: any[];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createDonutChart();
  }

  createDonutChart(): void {
    const ctx = document.getElementById('donutChart') as HTMLCanvasElement;
    const labels = this.datasetSummary.map(summary => summary.domain__name);
    const data = this.datasetSummary.map(summary => summary.count);

    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#2196F3'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#2196F3']
        }]
      }
    });
  }
}
