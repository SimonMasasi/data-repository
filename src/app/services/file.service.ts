import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private fileData: File[] = [];

  constructor() { }
  addFile(files: FileList | null): File[] | void {
    if (files) {
      const newFileList = new DataTransfer();
      for (let i = 0; i < this.fileData.length; i++) {
        newFileList.items.add(this.fileData[i]);
      }
  
      // Iterate over files and add each file individually
      for (let i = 0; i < files.length; i++) {
        newFileList.items.add(files[i]);
      }
  
      // Convert FileList to Array of File
      const fileArray: File[] = Array.from(newFileList.files);
  
      this.fileData = fileArray;
  
      // Return updated file data
      return this.fileData;
    }
  }
  
  removeFile(index: number): void {
    if (this.fileData.length > 0 && index >= 0 && index < this.fileData.length) {
      const newDataTransfer = new DataTransfer();
  
      for (let i = 0; i < this.fileData.length; i++) {
        if (i !== index) {
          newDataTransfer.items.add(this.fileData[i]);
        }
      }
  
      // Update fileData with new list
      this.fileData = Array.from(newDataTransfer.files);
    }
  }
  
}
