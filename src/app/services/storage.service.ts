import {Injectable} from '@angular/core';
import * as SecureLS from 'secure-ls';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private ls = new SecureLS({encodingType: 'aes', isCompression: true});

  constructor() {
  }

  setItem(itemName: string, itemValue: string | number) {
    this.ls.set(itemName, itemValue);
  }

  getItem(itemName: string) {
    return this.ls.get(itemName);
  }

  removeItem(itemName: any) {
    this.ls.remove(itemName);
  }

  clearStorage() {
    this.ls.removeAll();
  }


  clearProjectContent() {
    this.removeItem('projectName');
    this.removeItem('projectIcon');
    this.removeItem('uniqueCode');
    this.removeItem('projectUniqueId');
  }


}
