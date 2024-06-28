import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { AllUsersComponent } from './all-users/all-users.component';
import { UserDatasetComponent } from './user-dataset/user-dataset.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { RolesUsersComponent } from './roles-users/roles-users.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UnauthoridedComponent } from './unauthorided/unauthorided.component';
import { PasswordChangeComponent } from './password-change/password-change.component';


@NgModule({
  declarations: [
    AllUsersComponent,
    UserDatasetComponent,
    UserRolesComponent,
    RolesUsersComponent,
    UserProfileComponent,
    DashboardComponent,
    UnauthoridedComponent,
    PasswordChangeComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatTooltipModule,
  ]
})
export class UserModule { }
