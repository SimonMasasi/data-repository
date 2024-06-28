import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService { // Replace with your API endpoint
  private url="";
  constructor(
    private http: HttpClient,
     private router: Router,
     
     ) {}
  private APIUrl = environment.apiUrl;
  
  getAllUsers(){
    this.url = this.APIUrl + "/auth/all-users/";
    return this.http.get<any>(this.url)
  }

  getUserDatasets(userId: string){
    this.url = this.APIUrl + `/auth/user-datasets/${userId}/`
    return this.http.get<any>(this.url);
  }

  checkIfFullLayoutLoaded() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/dashboard/')) {
      console.log("True");
      return true;
    } else {
      console.log("False");
      return false;
    }
  }

  getUserRoles(){
    this.url = this.APIUrl + `/auth/user-roles/`
    return this.http.get<any>(this.url);
  }

  getRoleUsers(roleId: number){
    this.url = this.APIUrl + `/auth/role-users/${roleId}`
    return this.http.get<any>(this.url);
  }

  addRole(roleData: any) {
    this.url = this.APIUrl + "/auth/add-role/";
    return this.http.post<any>(this.url, roleData);
  }

  addRoleUser(roleUserData: any) {
    console.log(roleUserData);
    this.url = this.APIUrl + "/auth/add-role-user/";
    return this.http.post<any>(this.url, roleUserData);
  }

  deleteUser(userId: number){
    this.url=this.APIUrl + `/auth/delete_user/${userId}/`
    return this.http.delete<any>(this.url);
  }


  deactivateUser(userId: number){
    this.url = this.APIUrl + `/auth/deactivate_user/${userId}/`;
    return this.http.post<any>(this.url, {});
  }

  activateUser(userId: number){
    this.url = this.APIUrl + `/auth/activate_user/${userId}/`;
    return this.http.post<any>(this.url, {});
  }

  editUser(userId: number, userData: any){
    this.url = this.APIUrl + `/auth/edit_user/${userId}/`
    return this.http.patch<any>(this.url, userData);
  }

  getUser(userId: number) {
    this.url = this.APIUrl + `/auth/user_detail/${userId}/`;
    return this.http.get<any>(this.url);
  }

  getUserProfile(userId: number){
    this.url = this.APIUrl + `/auth/user-profile/${userId}/`
    return this.http.get<any>(this.url);
  }

  getDashboardSummary() {
    this.url = this.APIUrl + "/auth/dashboard/"
    return this.http.get<any>(this.url);
  }

  getLandingData(){
    this.url = this.APIUrl + "/auth/landing/"
    return this.http.get<any>(this.url);

  }
}
