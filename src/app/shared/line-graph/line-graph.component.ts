import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.scss']
})
export class LineGraphComponent implements OnInit {
  @Input() labels: string[] = [];
  @Input() counts: number[] = [];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.renderGraph();
  }

  renderGraph() {
    const ctx = document.getElementById('lineGraph') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Dataset Downloads Over Time',
          data: this.counts,
          borderColor: 'rgb(75, 192, 192)',
          fill: false
        }]
      },
    });
  }
}
