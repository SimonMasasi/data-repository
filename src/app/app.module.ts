import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { LoginComponent } from './guest/login/login.component';
import { RegisterComponent } from './guest/register/register.component';
import { DatasetsModule } from './modules/datasets/datasets.module';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';  // Import here
import { ModelsModule } from './modules/models/models.module';
import { VerificationComponent } from './guest/verification/verification.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { SvgIcon, SvgIconsService } from './services/svg-icons.service';
import { MatIconRegistry } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { UserModule } from './modules/user/user.module';
import { HistoryService } from './services/history.service';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
// import { MatThemeModule } from '@angular/material/theming';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    VerificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DatasetsModule,
    SharedModule,
    UserModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule, 
    ModelsModule,
    NgOtpInputModule,
    NgxMatSelectSearchModule,
    // MatIconModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}, {})
  ],
  exports: [
    DatasetsModule,
    UserModule,
    MaterialModule,
    SharedModule,
    CommonModule,
    ModelsModule,
    // MatIconModule,
  ],
  providers: [
    HistoryService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {  
  constructor(
    private matIconRegistry: MatIconRegistry,
    private svgIconService: SvgIconsService,
    private domSanitizer: DomSanitizer
  ) {
    let x: SvgIcon;
    for (x of this.svgIconService.customSvgIcons) {
      this.matIconRegistry.addSvgIconLiteral(
        x.name,
        this.domSanitizer.bypassSecurityTrustHtml(x.tag)
      );
    }
  }
 }
