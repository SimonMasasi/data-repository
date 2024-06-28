import { Component } from '@angular/core';
import { DatasetService } from 'src/app/services/dataset.service';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'user-dataset-app',
  templateUrl: './user-dataset.component.html',
  styleUrl: './user-dataset.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ])
  ]
})

export class UserDatasetComponent {
  searchBackendText='';
  searchText='';
  datasets: any;
  originalDatasets: any;
  error: any;
  isLoading = false;
  message:any;
  selectedSortColumn: any;
  sortColumns=['name', 'domain', 'downloads', 'viewers']
  showContent = false;
  downloadError: any;
  confirmDeleteId: number | null = null;
  hasDashboard: any
  userId: any;
  constructor(
    private datasetService: DatasetService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute, 
    private userService: UserService
    ){}

  confirmDelete(datasetId: number) {
    this.confirmDeleteId = datasetId;
  }

  showDeleteInfo() {
    this.toastr.info('delete successfully', 'Dataset delete dialogue');
  }
  deleteConfirmed() {
    if (this.confirmDeleteId !== null) {
      console.log('Deleting dataset with ID:', this.confirmDeleteId);
      this.datasetService.deleteDataset(this.confirmDeleteId).subscribe(response=>{
        console.log("deleted");
       this.showDeleteInfo();    
      })
    }
  }

  cancelDelete() {
    this.confirmDeleteId = null;
  }
  ngOnInit(): void {
    this.hasDashboard=this.userService.checkIfFullLayoutLoaded();
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      this.userService.getUserDatasets(this.userId)
    .subscribe(datasets => {
      this.datasets = datasets;
      this.originalDatasets=datasets;
      this.isLoading = false;
    }, error => {
      this.error = error;
      this.isLoading = false;
    });
    });
    
  }
  
  toggleContent() {
    this.showContent = !this.showContent;
  }
  searchBackendDatasets() {
    console.log(this.searchBackendText);
    if (!this.searchBackendText) {
      return this.ngOnInit()
    }
    this.datasetService.getAllDatasets(1, "", "", false)
    .subscribe(datasets => {
      this.datasets = datasets;
      this.originalDatasets=datasets;
      this.isLoading = false;
    }, error => {
      this.error = error;
      this.isLoading = false;
    });
    }


  updateViewers(id: number) {
    this.datasetService.updateViewers(id)
    .subscribe(
      () => this.message="success",
    );;
  }
  showSuccess() {
    this.toastr.success('dataset zip download successfully', 'file download dialogue');
  }

  downloadDataset(datasetId: number) {
    console.log("dataset downloaded");
    this.datasetService.updateDownloads(datasetId);
    this.datasetService.downloadDataset(datasetId)
      .subscribe(
        (response: HttpResponse<Blob>) => {
          const filename = response.headers.get('filename') || 'dataset.zip';
        
          // Ensure response.body is a Blob before using saveAs
          if (response.body) {
            saveAs(response.body, filename);
            this.showSuccess();
            this.downloadError = '';
          } else {
            this.downloadError = 'Error: Invalid response received.';
          }
        },
        (error) => {
          this.downloadError = 'Error downloading dataset: ' + error.message;
        }
      );
  }

  sortDatasets() {
    if (!this.selectedSortColumn) {
      return; // No sorting criteria
    }
    this.datasets.sort((a: { name: string; domain: { name: string; }; id: number; downloads: number; viewers: number; }, b: { name: any; domain: { name: any; }; id: number; downloads: number; viewers: number; }) => {
      const sortField = this.selectedSortColumn;
      if (sortField === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortField === 'domain') {
        return a.domain.name.localeCompare(b.domain.name);
      } else if (sortField === 'downloads') {
        return b.downloads - a.downloads; // Sort descending by downloads
      } else if (sortField === 'viewers') {
        return b.viewers - a.viewers; // Sort descending by viewers
      } else {
        console.error(`Invalid sort criteria: ${sortField}`);
        return 0;
      }
    });
  }

  searchDatasets() {
    console.log(this.searchText);
    if (!this.searchText) {
      this.datasets = [...this.originalDatasets]; // Reset to original data
      return;
    }
    this.datasets = this.originalDatasets.filter((dataset: { name: string; domain: { name: string; }; }) => {
      const searchTerm = this.searchText.toLowerCase();
      return dataset.name.toLowerCase().includes(searchTerm) ||
             dataset.domain.name.toLowerCase().includes(searchTerm)
             // ... include other searchable fields (optional)
    });
  }
}
