import { Component } from '@angular/core';
import { HistoryService } from './services/history.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private location: Location,
    private historyService: HistoryService
  ) {}
  ngOnInit(): void {
    const currentUrl = this.location.path();
    this.historyService.addToHistory(currentUrl);
  }
  title = 'data-wire-repo';
}
