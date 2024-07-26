import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { ModelService } from 'src/app/services/model.service';
import { ToastrService } from 'ngx-toastr'
import { FileViewerComponent } from 'src/app/shared/component/file-viewer/file-viewer.component';

interface ModelDetailsResponse {
  model: any;
  files: any[];
}

import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-model-view',
  templateUrl: './model-view.component.html',
  styleUrl: './model-view.component.scss'
})
export class ModelViewComponent {

  submitMessageForm = {
    message: '',
  };
  submitUserForm ={
    userId:null
  };
  canUserShare:boolean=false;
  value:any;
  regionsCopy : any[]=[]

  chat_messages :any;
  chatModelIsOpen=false;
  modelId: string|any;
  model: any;
  error: any;
  message: any;
  downloadError: any;
  modelFiles: any;
  downloads: any;
  confirmDeleteId: number | null = null;
  confirmUpdate: any|null=null;
  file: File|any;
  chatMyOtherModelIsOpen=false
  user:any;
  allUsers:any;
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
  constructor(
    private route: ActivatedRoute, 
    private modelService: ModelService,
    private toastr: ToastrService,
    private router:Router,
    private authService:AuthService,
    private dialog: MatDialog,
    )  {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.route.paramMap.subscribe(params => {
      this.modelId = params.get('id');
      this.getFolders(this.parentFolderId, this.currentPage,this.modelId);
      this.getFiles(this.parentFolderId, this.currentPage);
      this.modelService.modelDetails(this.modelId)
        .subscribe((data: any) => {
          const parsedData = data as ModelDetailsResponse;
          this.model = parsedData.model;
          this.modelFiles = parsedData.files;
          this.canUserShare = localStorage.getItem("email")===parsedData.model.repository.owner.email
        });
    });

    this.data_subscribe = timer(0, 3000).pipe(

      switchMap(() => this.modelService.getChatsFromChatRoom(this.modelId))

    ).subscribe(result => 

      this.chat_messages = result

    );


    this.getDownloadsData();
    this.updateModelViewers();
    this.modelService.getAllUsers().subscribe((response)=>{
      this.allUsers = response
      this.regionsCopy=response
    })


  }

  closeTheOtherModel(){
    this.chatMyOtherModelIsOpen=false
  }
  openFileViewer(fileId: string): void {
    this.modelService.viewFile(fileId).subscribe(
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


  changed(value: any) {
    console.log(value)
    this.regionsCopy=this.filterCountries(value)
  }
  filterCountries(input:any) {
    const myList = []
    if(input){
      for(let i=0;i<this.allUsers.length;i++){
        if(this.allUsers[i].username.toLowerCase().includes(input.toLowerCase())){
          myList.push(this.allUsers[i]);
        }

      }
      return myList
    }
    else{
      return this.allUsers;
    }


  }



  SubmitCountry():void{
    if(this.submitUserForm.userId==null){
      this.toastr.warning("please select desired user")
      return;
    }

    const foodBar = this.allUsers.find((item:any) => item.username === this.submitUserForm.userId);


    this.modelService.createNewModelUser(this.modelId , foodBar.id).subscribe((response)=>{
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
  
  toggleFolder(folder: any) {
    if (!folder.loaded) {
      this.modelService.getFolders(folder.id, this.currentPage, this.modelId)
        .subscribe(folders => {
          folder.subFolders = folders.results;
          folder.loaded = true;
        });
  
      this.modelService.getFiles(folder.id, this.currentPage)
        .subscribe(files => {
          folder.files = files.results;
          folder.loaded = true;
        });
    }
  
    folder.opened = !folder.opened;
  }
  
  toggleSubfolder(subfolder: any) {
    if (!subfolder.loaded) {
      this.modelService.getFolders(subfolder.id, this.currentPage, this.modelId)
        .subscribe(folders => {
          subfolder.subFolders = folders.results;
          subfolder.loaded = true;
        });
  
      this.modelService.getFiles(subfolder.id, this.currentPage)
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



  openChatModel(){
    this.chatModelIsOpen = !this.chatModelIsOpen;

    if (this.chatModelIsOpen){
      this.modelService.getChatsFromChatRoom(this.modelId).subscribe(
        (response)=>{
          console.log(response)
          this.chat_messages = response

        }
      )
    }
  }

  createChatMessage():void{
    this.modelService.createChatsFromChatRoom(this.model.id , this.submitMessageForm.message).subscribe(
      (response)=>{
        console.log(response)
        this.chat_messages = [...this.chat_messages,response]
        this.submitMessageForm.message=""
      }
    )
  }

  getFolders(parentFolderId: number, currentPage:number,modelId: number): void {
    this.modelService.getFolders(parentFolderId, currentPage, modelId)
      .subscribe(folders => {
        this.folders = folders.results;
        console.log(this.folders);
      });
      console.log(this.folders);
  }

  getFiles(parentFolderId: number, currentPage: number): void {
    this.modelService.getFiles(parentFolderId, currentPage)
      .subscribe(files => this.files = files);
      console.log(this.files);
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  updateModelViewers(){
    this.modelService.updateViewers(this.modelId).subscribe(data => {
      console.log("Viewers updated");
    });
  }

  getDownloadsData(){
    this.modelService.getModelDownloadsPerDay(this.modelId).subscribe(data => {
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
  this.modelService.updateFile(this.confirmUpdate, formData).subscribe(response=>{});
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
  this.toastr.info('Model file delete successfully', 'Model file delete');
}

deleteConfirmed() {
  if (this.confirmDeleteId !== null) {
    console.log('Deleting model with ID:', this.confirmDeleteId);
    this.modelService.deleteModelFile(this.confirmDeleteId).subscribe(response=>{
      console.log("deleted");
     this.showDeleteInfo();

  this.confirmUpdate = null;
  this.confirmDeleteId = null;
    })
  }
}

onFileChanged(event: any) {
  const fileId = 1; // Replace with the ID of the model file you want to update
  const file = event.target.files[0];
  if (file) {
    this.modelService.updateFile(fileId, file).subscribe(
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

deleteModelFile(modelId: number){
  this.modelService.deleteModelFile(modelId).subscribe(response=>{})
}

  updateViewers(id: number) {
    this.modelService.updateViewers(id)
    .subscribe(
      () => this.message="success",
    );;
  }

  downloadModel(modelId: number) {
    if(!this.authService.isLoggedIn()){
      this.toastr.warning("login to download models")
      return
    }
    
    console.log("model downloaded");
    this.modelService.downloadModel(modelId)
      .subscribe(
        (response: HttpResponse<Blob>) => {
          const filename = response.headers.get('filename') || 'model.zip';
        
          // Ensure response.body is a Blob before using saveAs
          if (response.body) {
            saveAs(response.body, filename);
            this.downloadError = '';
          } else {
            this.downloadError = 'Error: Invalid response received.';
          }
        },
        (error) => {
          this.downloadError = 'Error downloading model: ' + error.message;
        }
      );
      this.modelService.updateDownloads(modelId);
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
  //   this.modelService.downloadFile(url);
  // }
  closeModal(){
    this.isUserModalOpen=false;
  }
  downloadFile(file: any) {
    if(!this.authService.isLoggedIn()){
      this.toastr.warning("login to download models")
      return
    }
    this.modelService.downloadFile(file.id).subscribe(
      (data: Blob) => {
        // Create a blob URL for the file data
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link element
        const a = document.createElement('a');
        a.href = url;
        const file_name=file.name + file.file_extension
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
    this.toastr.error('You had alredy upvoted this model', 'Upvoting dialogue');
  }
  showUpvoteSuccess() {
    this.toastr.success('Successfully Upvoted', 'Upvoting dialogue');
  }
  upvoteModel(modelId: number): void {
    this.modelService.upvoteModel(modelId).subscribe(
      response => {
        if(response.message){
          this.showReadyUpvoted();
        }else{
          this.showUpvoteSuccess();
        console.log('Model upvoted successfully:', response);
        }
      },
      error => {
        // Handle error, e.g., display error message
        console.error('Error upvoting model:', error);
      }
    );
  }

  
}
