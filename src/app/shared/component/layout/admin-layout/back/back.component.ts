import { Component } from '@angular/core';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrl: './back.component.scss'
})
export class BackComponent {

  constructor(private historyService: HistoryService) { }

  goBack(): void {
    this.historyService.goBack();
  }
  
  hasPreviousUrl(): boolean {
    return this.historyService.hasPreviousUrl();
  }
}
