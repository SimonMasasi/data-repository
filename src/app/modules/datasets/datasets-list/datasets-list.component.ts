import { Component } from '@angular/core';
import { DatasetService } from 'src/app/services/dataset.service';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-datasets-list',
  templateUrl: './datasets-list.component.html',
  styleUrls: ['./datasets-list.component.scss']
})
export class DatasetsListComponent {
  downloadError = '';
  searchBackendText='';
  searchText='';
  datasets: any;
  originalDatasets: any;
  error: any;
  isLoading = false;
  message:any;
  selectedSortColumn: any;
  hasDashboard: any;
  sortColumns=['title', 'domain', 'downloads', 'viewers', 'Latest']
  isClicked=false;
  currentPage = 1;
  totalPages = 1;
  categories: any;
  checkedCategories: string[] = []; 
  isDownloading=false;
  datasetNo:any;
  isUserModalOpen=false;
  constructor(
    private datasetService: DatasetService,
    private toastr: ToastrService,
    private userServise: UserService,
    private authService: AuthService
    ){}
  showContent = false; // Initial state: content hidden

  toggleContent() {
    this.showContent = !this.showContent;
    this.isClicked = !this.isClicked;

  }
  ngOnInit(): void {
    this.getCategories();
    this.hasDashboard=this.userServise.checkIfFullLayoutLoaded();
    this.loadDatasets();
    
  }

  loadDatasets(){
    this.datasetService.getAllDatasets(this.currentPage, this.searchBackendText, this.checkedCategories, false)
    .subscribe(datasets => {
      this.datasetNo=datasets.count;
      this.datasets = datasets.results;
      this.originalDatasets=datasets.results;
      this.sortDatasets()
      this.isLoading = false;
      this.totalPages = Math.ceil(datasets.count / 15);
    }, error => {
      this.error = error;
      this.isLoading = false;
    });
  }

  onPageChange(pageNumber: number) {
    console.log(pageNumber+"Changed");
    this.currentPage = pageNumber;
    this.loadDatasets();
  }

    showSuccess() {
      this.toastr.success('dataset zip download successfully', 'file download dialogue');
    }

  getCategories(){
    this.datasetService.getDomains().subscribe(categories=>{
      this.categories=categories
    })
  }
  closeModal(){
    this.isUserModalOpen=false;
  }
  downloadDataset(dataset: any) {
    if(!this.authService.isLoggedIn()){
      this.isUserModalOpen=true;
      return
    }
    this.isDownloading=true;
    this.datasetService.updateDownloads(dataset.id);
    this.datasetService.downloadDataset(dataset.id)
      .subscribe(
        (response: HttpResponse<Blob>) => {
          const filename = response.headers.get('filename') || dataset.repository.name +"-"+ dataset.title;
        
          // Ensure response.body is a Blob before using saveAs
          if (response.body) {
            saveAs(response.body, filename);
            this.showSuccess();
            this.isDownloading=false;
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

  filterDatasets(): void {
    // Check if originalDatasets is an array before filtering
    if (Array.isArray(this.originalDatasets)) {
      this.datasets = this.originalDatasets.filter((dataset: { domain: { name: string; }; }) => this.checkedCategories.includes(dataset.domain.name));
    } else {
      console.error("originalDatasets is not an array.");
    }
  }
  
onCategoryChange(category: string, event: any): void {
  const isChecked = event.target.checked;
  if (isChecked) {
    // Add the category to checkedCategories array if it's checked
    if (!this.checkedCategories.includes(category)) {
      this.checkedCategories.push(category);
    }
  } else {
    // Remove the category from checkedCategories array if it's unchecked
    const index = this.checkedCategories.indexOf(category);
    if (index !== -1) {
      this.checkedCategories.splice(index, 1);
    }
  }
  if(this.checkedCategories.length==0){
    this.datasets=this.originalDatasets;
    return
  }
  this.filterDatasets(); // Filter datasets based on checked categories
}

  
  sortDatasets() {
    if (!this.selectedSortColumn) {
      return; // No sorting criteria
    }
    
    this.datasets.sort((a: { title: string; domain: { name: string; }; downloads: number; created_at: string | number | Date; viewers: number; }, b: { title: any; domain: { name: any; }; downloads: number; created_at: string | number | Date; viewers: number; }) => {
      const sortField = this.selectedSortColumn;
  
      if (sortField === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortField === 'domain') {
        return a.domain.name.localeCompare(b.domain.name);
      } else if (sortField === 'downloads') {
        return b.downloads - a.downloads;
      } else if (sortField === 'Latest') {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; 
      } else if (sortField === 'viewers') {
        return b.viewers - a.viewers;
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
    this.datasets = this.originalDatasets.filter((dataset: { title: string; domain: { name: string; }; }) => {
      const searchTerm = this.searchText.toLowerCase();
      return dataset.title.toLowerCase().includes(searchTerm) ||
             dataset.domain.name.toLowerCase().includes(searchTerm)
    });
  }

  
}
