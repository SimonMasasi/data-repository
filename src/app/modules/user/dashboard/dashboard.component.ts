import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  summaryData: any;
  constructor(
    private userService: UserService,
  ){}

  ngOnInit(): void {
    this.fetchDashboardSummary();
    
  }
  fetchDashboardSummary(): void {
    this.userService.getDashboardSummary()
      .subscribe(
        (data) => {
          this.summaryData = data;
        },
        (error) => {
          console.error('Error fetching dashboard summary:', error);
        }
      );
  }
  getLabels() {
    console.log(this.summaryData?.dataset_downloads_data?.map((entry: { day: any; }) => entry.day) || []);
    return this.summaryData?.dataset_downloads_data?.map((entry: { day: any; }) => entry.day) || [];
  }

  getCounts() {
    console.log(this.summaryData?.dataset_downloads_data?.map((entry: { download_count: any; }) => entry.download_count) || []);
    return this.summaryData?.dataset_downloads_data?.map((entry: { download_count: any; }) => entry.download_count) || [];
  }
}
