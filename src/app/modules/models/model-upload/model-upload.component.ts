
import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModelService } from '../../../services/model.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-model-upload',
  templateUrl: './model-upload.component.html',
  styleUrl: './model-upload.component.scss'
})
export class ModelUploadComponent implements OnInit {

  private fileData: FileList = new DataTransfer().files;
  selectedFiles: File[] = [];
  selectedFile: any;
  submitMessageForm = {
    country: {
      id:1,
      name:"none"
    },
  };
  repo_name: any;
  email: any;
  scope: any;
  files: any;
  description: any;
  isLoading = false;
  title: any;
  chatModelIsOpen=true;
  domain: any;
  domains: any;
  tags = new FormControl<string[] | null>(null);
  regions :any;
  max = 5;
  constructor(
    private _formBuilder: FormBuilder,
    private modelUploadService: ModelService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.modelUploadService.getDomains().subscribe(response=>{
      this.domains=response;
    })

    this.modelUploadService.getRegions().subscribe(response=>{
      this.regions= response;
    })
    this.addFile([]);
  }

  showSuccess() {
    this.toastr.success('Successfully Uploaded', 'file upload');
  }

  showFailure() {
    this.toastr.error('Model not uploaded enter the valid data', 'upload status');
  }
  onSubmit() {
    console.log("Submission started")
    if (this.isFirstValid() && this.isSecondValid() && this.isThirdValid() && this.description != '') {


      this.isLoading=true
      this.cdr.detectChanges(); // Manually trigger change detection

      
      console.log("The form is valid")
      const formData = new FormData();
      formData.append('repo_name', this.repo_name);
      formData.append('email', this.email);
      formData.append('scope', this.scope);
      formData.append('title', this.title); 
      formData.append('description', this.description);
      formData.append('domain', this.domain);
      const valuesArray: string[] | null = this.tags.value;
      if (valuesArray) {
        for (let i = 0; i < valuesArray.length; i++) {
          formData.append('tags', valuesArray[i]);
        }
      }
      for (let i=0; i<this.fileData.length; i++) {
      formData.append('files', this.fileData[i]);
      }
      console.log(this.domain);

      const token = localStorage.getItem('token');
      this.isLoading=true // Retrieve token from local storage
      this.modelUploadService.uploadModel(formData, token)?.subscribe(
        (response) => {
          console.log('Response:', response);
          this.showSuccess();
          this.isLoading=false 
          this.cdr.detectChanges(); // Manually trigger change detection
          this.router.navigate(['/my-models']);
        },
        (error) => {
          console.error('Error:', error);
          this.isLoading=false 
          // Handle error, maybe show an error message
        }
      );
    } else {
      this.showFailure();
      this.cdr.detectChanges(); // Manually trigger change detection
      this.isLoading=false 
    }
  }
  validateFirstStep(): boolean {
    return this.repo_name != '' && this.email != '' && this.scope != '';
  }


  closeTheOtherModel(){
    this.chatModelIsOpen=false;
    this.router.navigate(['/my-models'])
  }
  
  validateSecondStep(): boolean {
    return this.fileData.length > 0 ; // Assuming at least one file is required
  }
  
  validateThirdStep(): boolean {
    return this.description !== '' && this.title !== '' && this.domain !== '';
  }
  
  isFirstValid(): boolean {
    return this.validateFirstStep();
  }
  
  isSecondValid(): boolean {
    return this.validateSecondStep();
  }
  
  isThirdValid(): boolean {
    return this.validateThirdStep();
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files;
    this.addFile(this.selectedFile);
  }


  SubmitCountry():void{
    if(this.submitMessageForm.country?.name=="none"){
      this.toastr.warning("please select desired country")
      return;
    }
    if(this.submitMessageForm.country?.name.toLocaleLowerCase()!="tanzania"){
      this.toastr.error("sorry only Tanzania related models are allowed")
      this.router.navigate(['/my-models'])
    }
    this.chatModelIsOpen=false;

  }
  
  addFile(files: any) {
    console.log(files , "enteroing dcgxhubnmld")
    const newFileList = new DataTransfer();
    for (let i = 0; i < this.fileData.length; i++) {
      newFileList.items.add(this.fileData[i]);
    }
  
    // Iterate over this.selectedFile and add each file individually
    for (let i = 0; i < files.length; i++) {
      newFileList.items.add(files[i]);
    }
  
    this.fileData = newFileList.files;
  
    // Clear previous list (optional)
    const element = document.getElementById('file-list') as HTMLElement;
    element.style.color = 'red'; // Now TypeScript knows it's not null
    
    // Create list items for each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      // Create list item element
      const listItem = document.createElement('li');
      listItem.textContent = file.name;
  
      const removeButton = document.createElement('button');
      removeButton.textContent = 'X';
      removeButton.classList.add('bg-red-500', 'hover:bg-red-700', 'text-white', 'font-bold', 'px-2', 'rounded-full'); 
      removeButton.classList.add('remove-file-btn');
      
      // Store the index of the file using data attribute
      removeButton.setAttribute('data-index', (this.fileData.length - files.length + i).toString());
  
      // Attach event listener
      removeButton.addEventListener('click', (event) => {
        const index = parseInt((event.target as HTMLElement).getAttribute('data-index') || '0');
        this.removeFile(listItem, index);
      });
  
      // Append button and file name to list item
      listItem.appendChild(removeButton);
      listItem.classList.add('flex', 'items-center', 'justify-between', 'p-2', 'mt-1', 'bg-gray-100', 'rounded-lg'); // Tailwind classes for list item styling
      element.appendChild(listItem);
    }
    console.log(this.fileData);
  }
  
  removeFile(listItem: HTMLLIElement, index: number) {
    const element = document.getElementById('file-list') as HTMLElement;
    const files = this.fileData; // Use fileData directly
  
    if (files.length > 0) { // Ensure there are files before proceeding
      // Create a new DataTransfer object
      const newDataTransfer = new DataTransfer();
  
      for (let i = 0; i < files.length; i++) {
        if (i !== index) {
          newDataTransfer.items.add(files[i]);
        }
      }
  
      // Create a new FileList object using DataTransfer
      const fileList = newDataTransfer.files;
  
      // Assign the fileList to fileData
      this.fileData = fileList;
    }
  
    // Remove list item from UI
    listItem.remove();
    console.log(this.fileData);
  }
  
  
  onDragOver(event: DragEvent) {
    event.preventDefault(); // Prevent default browser behavior
  }

  onDrop(event: DragEvent) {
    event.preventDefault(); // Prevent default browser behavior
    this.selectedFile = event.dataTransfer?.files; // Access dropped files
    this.addFile(this.selectedFile)
  
  }
}