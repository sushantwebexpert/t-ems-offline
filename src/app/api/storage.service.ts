import { Injectable } from '@angular/core';
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  async saveVoter(formData: any) {
    if (window.electron) {
      const result = await window.electron.invoke('voter-add', formData);
      return result;
    } else {
      console.warn('Not running inside Electron');
    }
  }

  async getAllVoters(): Promise<any[]> {
    return await window.electronAPI.invoke('get-voters');
  }

}
