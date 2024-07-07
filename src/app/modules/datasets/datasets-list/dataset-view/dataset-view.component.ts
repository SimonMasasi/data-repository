import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { DatasetService } from 'src/app/services/dataset.service';
import { ToastrService } from 'ngx-toastr'
import { FileViewerComponent } from 'src/app/shared/component/file-viewer/file-viewer.component';
import { interval, switchMap, timer } from 'rxjs';


interface DatasetDetailsResponse {
  dataset: any;
  files: any[];
}

import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dataset-view',
  templateUrl: './dataset-view.component.html',
  styleUrls: ['./dataset-view.component.scss'],
})


export class DatasetViewComponent {

  submitMessageForm = {
    message: '',
  };

  submitUserForm ={
    userId:{
      id:null
    }
  }
  canUserShare=false
  allUsers:any;
  chatMyOtherModelIsOpen=false
  datasetId: string|any;
  dataset: any;
  error: any;
  message: any;
  downloadError: any;
  datasetFiles: any;
  downloads: any;
  confirmDeleteId: number | null = null;
  confirmUpdate: any|null=null;
  file: File|any;
  user:any;
  value:any;
  chat_messages :any;
  data_subscribe:any;
  folders: any[] = [];
  files: File[] = [];
  parentFolderId=0; // Assuming you have a way to get the parent folder ID
  folderId: any; // Assuming you have a way to get the folder ID
  currentPage = 1;
  subFolders:any;
  subFiles: any;
totalPages: any;
isUserModalOpen=false;
chatModelIsOpen = false
  constructor(
    private route: ActivatedRoute, 
    private datasetService: DatasetService,
    private toastr: ToastrService,
    private router:Router,
    private authService:AuthService,
    private dialog: MatDialog,
    )  {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.route.paramMap.subscribe(params => {
      this.datasetId = params.get('id');
      this.getFolders(this.parentFolderId, this.currentPage,this.datasetId);
      this.getFiles(this.parentFolderId, this.currentPage);
      this.datasetService.datasetDetails(this.datasetId)
        .subscribe((data: any) => {
          const parsedData = data as DatasetDetailsResponse;
          this.canUserShare = localStorage.getItem("email")== parsedData.dataset.repository.owner.email
          this.dataset = parsedData.dataset;
          this.datasetFiles = parsedData.files;
        });
    });




    this.data_subscribe = timer(0, 3000).pipe(

      switchMap(() => this.datasetService.getChatsFromChatRoom(this.datasetId))

    ).subscribe(result => 

      this.chat_messages = result

    );
    this.getDownloadsData();
    this.updateDatasetViewers();

    this.datasetService.getAllUsers().subscribe((response)=>{
      this.allUsers = response
    })

  }



  SubmitCountry():void{
    if(this.submitUserForm.userId.id==null){
      this.toastr.warning("please select desired user")
      return;
    }

    this.datasetService.createNewDataUser(this.datasetId , this.submitUserForm.userId.id).subscribe((response)=>{
      if(response?.error){
        this.toastr.error(response?.message)
        return
      }
      this.toastr.success("Model shared successfully ")
    })

    this.chatMyOtherModelIsOpen=false;

  }


  openTheOtherModel(){
    this.chatMyOtherModelIsOpen=true
  }



  isLoggedIn(){
    return this.authService.isLoggedIn();
  }
  openFileViewer(fileId: string): void {
    this.datasetService.viewFile(fileId).subscribe(
      (file: Blob) => {
        const dialogRef = this.dialog.open(FileViewerComponent, {
          data: {
            fileUrl: URL.createObjectURL(file)
          }
        });
        dialogRef.afterClosed().subscribe(() => {
          // Do something after the dialog is closed
        });
      },
      error => {
        console.error('Error fetching file', error);
      }
    );
  }
  
  toggleFolder(folder: any) {
    if (!folder.loaded) {
      this.datasetService.getFolders(folder.id, this.currentPage, this.datasetId)
        .subscribe(folders => {
          folder.subFolders = folders.results;
          folder.loaded = true;
        });
  
      this.datasetService.getFiles(folder.id, this.currentPage)
        .subscribe(files => {
          folder.files = files.results;
          folder.loaded = true;
        });
    }
  
    folder.opened = !folder.opened;
  }
  
  toggleSubfolder(subfolder: any) {
    if (!subfolder.loaded) {
      this.datasetService.getFolders(subfolder.id, this.currentPage, this.datasetId)
        .subscribe(folders => {
          subfolder.subFolders = folders.results;
          subfolder.loaded = true;
        });
  
      this.datasetService.getFiles(subfolder.id, this.currentPage)
        .subscribe(files => {
          subfolder.files = files.results;
          subfolder.loaded = true;
        });
    }
  
    subfolder.opened = !subfolder.opened;
  }
  
  closeOtherFolders(openFolder: any) {
    this.folders.forEach(folder => {
      if (folder !== openFolder && folder.opened) {
        folder.opened = false;
      }
    });
  }
  
  toggleFolderOptions(folder: any) {
    folder.showOptions = !folder.showOptions;
  }

  toggleFileOptions(file: any) {
    file.showOptions = !file.showOptions;
  }

  getFolders(parentFolderId: number, currentPage:number,datasetId: number): void {
    this.datasetService.getFolders(parentFolderId, currentPage, datasetId)
      .subscribe(folders => {
        this.folders = folders.results
      });
      console.log(this.folders);
  }

  getFiles(parentFolderId: number, currentPage: number): void {
    this.datasetService.getFiles(parentFolderId, currentPage)
      .subscribe(files => this.files = files);
      console.log(this.files);
  }

  updateDatasetViewers(){
    this.datasetService.updateViewers(this.datasetId).subscribe(data => {
      console.log("Viewers updated");
    });
  }

  getDownloadsData(){
    this.datasetService.getDatasetDownloadsPerDay(this.datasetId).subscribe(data => {
      this.downloads =  data;
    });
  }

  getXaxis(){
    return this.downloads.map((entry: { date: any; }) => entry.date) || [];
  }

  getYaxis(){
    return this.downloads.map((entry: { download_count: any; }) => entry.download_count) || [];
  }

submitUpdates() {
  const formData = new FormData();
  formData.append('file', this.file);
  console.log("ready to update");
  console.log(formData);
  this.datasetService.updateFile(this.confirmUpdate, formData).subscribe(response=>{});
  console.log("updated");

  this.confirmUpdate = null;
  this.confirmDeleteId = null;
  }

  onFileSelected(event: any) {
    this.file = event.target.file;
  }

confirmDelete(fileId: number) {
  this.confirmDeleteId = fileId;
}

updatesDialogue(fileId: any) {
  this.confirmUpdate=fileId;
  }

showDeleteInfo() {
  this.toastr.info('Dataset file delete successfully', 'Dataset file delete');
}

deleteConfirmed() {
  if (this.confirmDeleteId !== null) {
    console.log('Deleting dataset with ID:', this.confirmDeleteId);
    this.datasetService.deleteDatasetFile(this.confirmDeleteId).subscribe(response=>{
      console.log("deleted");
     this.showDeleteInfo();

  this.confirmUpdate = null;
  this.confirmDeleteId = null;
    })
  }
}

onFileChanged(event: any) {
  const fileId = 1; // Replace with the ID of the dataset file you want to update
  const file = event.target.files[0];
  if (file) {
    this.datasetService.updateFile(fileId, file).subscribe(
      () => {
        console.log('File updated successfully');
        // Handle success
      },
      error => {
        console.error('Error updating file:', error);
        // Handle error
      }
    );
  }
}

cancelDelete() {
  this.confirmUpdate = null;
  this.confirmDeleteId = null;
}
transformData(data: any[]) {
  return data.map(item => ({
    date: item.date, // Use the entire date string
    download_count: item.download_count
  }));
}

deleteDatasetFile(datasetId: number){
  this.datasetService.deleteDatasetFile(datasetId).subscribe(response=>{})
}

  updateViewers(id: number) {
    this.datasetService.updateViewers(id)
    .subscribe(
      () => this.message="success",
    );;
  }

  downloadDataset(datasetId: number) {
    if(!this.authService.isLoggedIn()){
      this.toastr.warning("login to download data sets or models")
      return
    }
    
    console.log("dataset downloaded");
    this.datasetService.downloadDataset(datasetId)
      .subscribe(
        (response: HttpResponse<Blob>) => {
          const filename = response.headers.get('filename') || this.dataset.title;
        
          // Ensure response.body is a Blob before using saveAs
          if (response.body) {
            saveAs(response.body, filename);
            this.downloadError = '';
          } else {
            this.downloadError = 'Error: Invalid response received.';
          }
        },
        (error) => {
          this.downloadError = 'Error downloading dataset: ' + error.message;
        }
      );
      this.datasetService.updateDownloads(datasetId);
  }


  openChatModel(){
    this.chatModelIsOpen = !this.chatModelIsOpen;

    if (this.chatModelIsOpen){
      this.datasetService.getChatsFromChatRoom(this.datasetId).subscribe(
        (response)=>{
          console.log(response)
          this.chat_messages = response
        }
      )
    }
  }


  createChatMessage():void{
    this.datasetService.createChatsFromChatRoom(this.dataset.id , this.submitMessageForm.message).subscribe(
      (response)=>{
        console.log(response)
        this.chat_messages = [...this.chat_messages,response]
        this.submitMessageForm.message=""
      }
    )
  }

  getIconInfo(url: string): { iconClass: string, fileType: string } {
    // Extract file extension from the URL
    const extension = url.split('.').pop()?.toLowerCase();
  
    let iconClass = '';
    let fileType = '';
  
    // Determine the icon class and file type based on the extension
    switch (extension) {
      case 'csv':
        iconClass = 'fas fa-solid fa-file-csv';
        fileType = 'CSV';
        break;
      case 'xls':
      case 'xlsx':
        iconClass = 'mdi mdi-file-excel';
        fileType = 'Excel';
        break;
      case 'json':
        iconClass = 'mdi mdi-code-json'; // Choose appropriate JSON icon
        fileType = 'JSON';
        break;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        iconClass = 'mdi mdi-file-image';
        fileType = 'Image';
        break;
      case 'pdf':
        iconClass = 'fas fa-solid fa-file-pdf';
        fileType = 'Pdf';
        break;
      case 'odt':
        iconClass = 'fas fa-solid fa-file-word';
        fileType = 'document';
        break;
      case 'drawio':
        iconClass = 'fas fa-project-diagram';
        fileType = 'Drawio';
        break;
      default:
        iconClass = 'mdi mdi-file';
        fileType = 'Unknown';
        break;
    }
  
    return { iconClass, fileType };
  }
  
  // downloadFile(url: string): void {
  //   console.log("clicked obj");
  //   this.datasetService.downloadFile(url);
  // }
  closeModal(){
    this.isUserModalOpen=false;
  }
  downloadFile(file: any) {
    if(!this.authService.isLoggedIn()){
      this.toastr.warning("login to download data sets or models")
      return
    }
    this.datasetService.downloadFile(file.id).subscribe(
      (data: Blob) => {
        // Create a blob URL for the file data
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link element
        const a = document.createElement('a');
        a.href = url;
        const file_name=file.name
        a.download = file_name; // Provide a default name for the downloaded file
        document.body.appendChild(a);
        
        // Trigger the click event on the link to start the download
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Error downloading file:', error);
      }
    );
  }
  
  showMore: boolean = false;
  
  // Method to toggle the "showMore" property
  toggleShowMore() {
    this.showMore = !this.showMore;
  }
  showReadyUpvoted() {
    this.toastr.error('You had alredy upvoted this dataset', 'Upvoting dialogue');
  }
  showUpvoteSuccess() {
    this.toastr.success('Successfully Upvoted', 'Upvoting dialogue');
  }
  upvoteDataset(datasetId: number): void {
    this.datasetService.upvoteDataset(datasetId).subscribe(
      response => {
        if(response.message){
          this.showUpvoteSuccess();
        }else{
          this.showUpvoteSuccess();
        console.log('Dataset upvoted successfully:', response);
        }
      },
      error => {
        // Handle error, e.g., display error message
        console.error('Error upvoting dataset:', error);
      }
    );
  }
  
}
