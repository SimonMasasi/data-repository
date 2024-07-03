
import { Component } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';
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
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrl: './model-list.component.scss'
})
export class ModelListComponent {
  downloadError = '';
  searchBackendText='';
  searchText='';
  models: any;
  originalModels: any;
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
  loggedIn = this.authService.isLoggedIn();
  modelNo:any;
  isUserModalOpen=false;
  constructor(
    private modelService: ModelService,
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
    this.loadModels();
    
  }

  loadModels(){
    this.modelService.getAllModels(this.currentPage, this.searchBackendText, this.checkedCategories)
    .subscribe(models => {
      this.modelNo=models.count;
      this.models = models.results;
      console.log(this.models);
      this.originalModels=models.results;
      this.sortModels()
      this.isLoading = false;
      this.totalPages = Math.ceil(models.count / 15);
      console.log(this.totalPages+"Pages"); // Adjust this if page size varies
    }, error => {
      this.error = error;
      this.isLoading = false;
    });
  }

  onPageChange(pageNumber: number) {
    console.log(pageNumber+"Changed");
    this.currentPage = pageNumber;
    this.loadModels();
  }

    showSuccess() {
      this.toastr.success('model zip download successfully', 'file download dialogue');
    }

  getCategories(){
    this.modelService.getDomains().subscribe(categories=>{
      this.categories=categories
    })
  }
  closeModal(){
    this.isUserModalOpen=false;
  }
  downloadModel(model: any) {
    if(!this.authService.isLoggedIn()){
      this.isUserModalOpen=true;
      return
    }
    this.isDownloading=true;
    this.modelService.updateDownloads(model.id);
    this.modelService.downloadModel(model.id)
      .subscribe(
        (response: HttpResponse<Blob>) => {
          const filename = response.headers.get('filename') || model.repository.name +"-"+ model.title;
        
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
          this.downloadError = 'Error downloading model: ' + error.message;
        }
      );
  }

  filterModels(): void {
    // Check if originalModels is an array before filtering
    if (Array.isArray(this.originalModels)) {
      this.models = this.originalModels.filter((model: { domain: { name: string; }; }) => this.checkedCategories.includes(model.domain.name));
    } else {
      console.error("originalModels is not an array.");
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
    this.models=this.originalModels;
    return
  }
  this.filterModels(); // Filter models based on checked categories
}

  
  sortModels() {
    if (!this.selectedSortColumn) {
      return; // No sorting criteria
    }
    
    this.models.sort((a: { title: string; domain: { name: string; }; downloads: number; created_at: string | number | Date; viewers: number; }, b: { title: any; domain: { name: any; }; downloads: number; created_at: string | number | Date; viewers: number; }) => {
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
  

  searchModels() {
    console.log(this.searchText);
    if (!this.searchText) {
      this.models = [...this.originalModels]; // Reset to original data
      return;
    }
    this.models = this.originalModels.filter((model: { title: string; domain: { name: string; }; }) => {
      const searchTerm = this.searchText.toLowerCase();
      return model.title.toLowerCase().includes(searchTerm) ||
             model.domain.name.toLowerCase().includes(searchTerm)
    });
  }

  
}
