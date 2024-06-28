// history.service.ts
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private history: string[] = [];
  private maxHistoryLength: number = 10;

  constructor(private location: Location, private router: Router) {
    this.loadHistory();
    this.history.push(location.path());
    this.init();
  }

  private init(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        this.addToHistory(url);
      }
    });
  }

  private loadHistory(): void {
    const storedHistory = localStorage.getItem('history');
    if (storedHistory) {
      this.history = JSON.parse(storedHistory);
    }
  }

  private saveHistory(): void {
    localStorage.setItem('history', JSON.stringify(this.history));
  }

  addToHistory(url: string): void {
    if (this.history.length >= this.maxHistoryLength) {
      this.history.shift(); // Remove the oldest URL
    }
    if (this.history[this.history.length - 2] !== url) {
      this.history.push(url);
      this.saveHistory(); // Save history to localStorage
    }
    console.log(this.history.length);
    console.log(this.history[this.history.length - 1]);
    console.log(this.history);
  }

  goBack(): void {
    if (this.history.length > 1) {
      this.history.pop();
      const previousUrl = this.history.pop(); 
      if (previousUrl) {
        this.saveHistory(); // Save history to localStorage
        this.router.navigate([previousUrl]);
      }
    } else {
      console.log("No previous page in history");
    }
  }

  hasPreviousUrl(): boolean {
    return this.history.length > 1;
  }
}
