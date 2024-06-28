import { Component, OnInit } from '@angular/core';
import { DatasetService } from 'src/app/services/dataset.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { HttpResponse } from '@angular/common/http';
import * as Aos from 'aos';

@Component({
  selector: 'app-landig-page',
  templateUrl: './landig-page.component.html',
  styleUrls: ['./landig-page.component.scss'],
})
export class LandigPageComponent implements OnInit {
  datasets: any;
  hasDashboard: any;
  landingData: any;
  downloadError='';
  email = "simonejohnee@gmail.com"
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.fetchLandingSummary();
    this.initAOS();
    this.hasDashboard=this.userService.checkIfFullLayoutLoaded();
  }


  initAOS(): void {
    Aos.init({
    offset: 200,
    duration: 1000
    });
  }
  
  
  showSuccess() {
    this.toastr.success('dataset zip download successfully', 'file download dialogue');
  }


  fetchLandingSummary(): void {
    this.userService.getLandingData()
      .subscribe(
        (data) => {
          this.landingData = data;
        },
        (error) => {
          console.error('Error fetching dashboard summary:', error);
        }
      );
  }
  getLabels() {
    console.log(this.landingData.dataset_downloads_data.map((entry: { day: any; }) => entry.day) || []);
    return this.landingData.dataset_downloads_data.map((entry: { day: any; }) => entry.day) || [];
  }

  getCounts() {
    console.log(this.landingData.dataset_downloads_data.map((entry: { download_count: any; }) => entry.download_count) || []);
    return this.landingData.dataset_downloads_data.map((entry: { download_count: any; }) => entry.download_count) || [];
  }
}
