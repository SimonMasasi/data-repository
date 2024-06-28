import { Component } from '@angular/core';
import { DatasetService } from 'src/app/services/dataset.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-mydataset',
  templateUrl: './mydataset.component.html',
  styleUrl: './mydataset.component.scss',
})
export class MydatasetComponent {
  datasets: any;
  constructor(
    private datasetService: DatasetService,
    ){}
  ngOnInit(): void {
    this.datasetService.getAllDatasets(1, "", "", true)
      .subscribe(datasets => {
        this.datasets = datasets.results;
    }, error => {
    });
    
  }

}
