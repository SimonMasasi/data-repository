import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from '../../breadcrumbs/breadcrumbs.component';
import { BackComponent } from './back/back.component';
@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FullLayoutComponent,
    BreadcrumbsComponent,
    BackComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,


  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FullLayoutComponent,
    BackComponent
  ]

})
export class AdminLayoutModule { }
