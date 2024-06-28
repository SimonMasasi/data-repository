import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllUsersComponent } from './all-users/all-users.component';
import { UserDatasetComponent } from './user-dataset/user-dataset.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { RolesUsersComponent } from './roles-users/roles-users.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleGuard } from 'src/app/guards/role.guard';
import { UnauthoridedComponent } from './unauthorided/unauthorided.component';
import { PasswordChangeComponent } from './password-change/password-change.component';

const routes: Routes = [
  {
    path: "all-users", 
    component: AllUsersComponent,
  },  
  {
    path: "user-datasets/:userId", 
    component: UserDatasetComponent,
  },
  {
    path: "user-roles", 
    component: UserRolesComponent,
  },  
  {
    path: "role-users/:roleId", 
    component: RolesUsersComponent,
  },
  {
    path: "user-profile/:userId", 
    component: UserProfileComponent,
  },
  {
    path: "home", 
    component: DashboardComponent,
  }, 
  {
    path: "unauthorized", 
    component: UnauthoridedComponent,
  }, 
  {
    path: "change-password", 
    component: PasswordChangeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
