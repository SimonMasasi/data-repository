import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  token: string;
  roles: any // Assuming token is received from the API
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private APIUrl = environment.apiUrl; // Replace with your API endpoint
  private url="";

  constructor(private http: HttpClient, private router: Router) {}
  registerUser(userData: RegisterData): Observable<any> {
    this.url = this.APIUrl + "/auth/register/";
    return this.http.post<any>(this.url, userData)
    .pipe(
      map(response => {
        return response;
      }),
    );
  }

  verifyEmail(data: any): Observable<any> {
    this.url = this.APIUrl + "/auth/verify-account/";
    console.log(data);
    return this.http.post<any>(this.url, data);
  }

  // register(first_name:string, last_name:string, email: string, password: string){
  //   this.url = this.APIUrl + "auth/register/";
  //   return this.http.post(this.url, { first_name, last_name, email, password })
  //     .pipe(
  //       map(response => {
  //         return response;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  login(username: string, password: string): Observable<any> {
    this.url = this.APIUrl + "/auth/login/";
    return this.http.post<any>(this.url, { username, password })
      .pipe(
        map(response => {
          if (response?.error){
            return response
          }
          this.storeUserData(response);
          return response;
        }),
        catchError(this.handleError)
      );
  }


  Verify(username: string): Observable<any> {
    this.url = this.APIUrl + "/auth/verify/";
    return this.http.post<any>(this.url, { token:username })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': `Token ${localStorage.getItem('token')}` })
    };
    const url = `${this.APIUrl}/auth/change_password/`;
    const body = { old_password: oldPassword, new_password: newPassword };
    return this.http.post<any>(url, body, httpOptions);
  }

  storeEmail(email: string){
    localStorage.setItem('verification_email', email); 
  }

  private storeUserData(data: LoginResponse) {
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('email', data.email);  // Store user data
    localStorage.setItem('token', data.token); // Store token separately for security
    localStorage.setItem('roles', JSON.stringify(data.roles));
  }
  getUser(){
    const user = localStorage.getItem('user')
    if(user){
        return JSON.parse(user);
    }
  }
  
  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  logout() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': `Token ${localStorage.getItem('token')}` })
    };
    this.removeToken;
    this.url = this.APIUrl + "/auth/logout/";
    return this.http.post<any>(this.url, null, httpOptions); // Send a POST request
  }

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    localStorage.removeItem('email');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }



  hasRole(roleName: string): boolean {
    const userRolesString = localStorage.getItem('roles');
    
    if (userRolesString === null) {
      // Handle the case where userRolesString is null
      return false;
    }
    
    const userRoles: string[] = JSON.parse(userRolesString);
    return userRoles.includes(roleName);
  }
}

// import {StorageService} from './storage.service';
// import {environment} from '../../environments/environment';
// import {Injectable} from '@angular/core';
// import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
// import {BehaviorSubject, Observable} from 'rxjs';
// import {first, map} from 'rxjs/operators';
// import {Router} from '@angular/router';
// import {NgxPermissionsService} from 'ngx-permissions';
// import {Store} from '@ngrx/store';
// // import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
// // import {AppState} from '../store/reducers';
// import {Apollo} from "apollo-angular";
// import {NotificationService} from "./notification.service";
// // import {TOKEN_AUTH, USER_DETAIL, USER_ROLES} from "../guest/create-account/login/login.graphql";

// export interface AuthTokenModel {
//   access_token: string;
//   token_type: string;
//   refresh_token: string;
//   expires_in: number;
//   scope: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   authority: any;
//   objectPerms: any;
//   perms: any;
//   // taesaRegistrationNumber$ = new BehaviorSubject<string>(undefined);
//   // photoUrl$ = new BehaviorSubject<string>(undefined);
//   principal: any;
//   private errorCode: any;

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     // private snackbar: MatSnackBar,
//     private permissionsService: NgxPermissionsService,
//     // private store: Store<AppState>,
//     private apollo: Apollo,
//     private notificationService: NotificationService,
//     private storage: StorageService
//   ) {
//   }
//   //
//   //
//   // async login(formData: any): Promise<AuthTokenModel> {
//   //   return await this.apollo
//   //     .mutate({
//   //       mutation: TOKEN_AUTH,
//   //       variables: {
//   //         username: formData?.username,
//   //         password: formData?.password
//   //       },
//   //     })
//   //     .pipe(
//   //       this.notificationService.catchError(
//   //         'Authentication Error'
//   //       ),
//   //       map(({data}: any) => {
//   //         if (data) {
//   //           if (data.tokenAuth) {
//   //             let data_ = data?.tokenAuth;
//   //             this.storage.setItem('currentClient', data_.token);
//   //             this.storage.setItem('refreshToken', data.refreshToken);
//   //             // this.storage.setItem('expireTime', user.expires_in);
//   //           } else {
//   //             this.notificationService.errorMessage("Access Denied");
//   //           }
//   //         }
//   //         return data;
//   //       })
//   //     ).toPromise()
//   //
//   // }
//   //
//   // async getUserDetails(): Promise<any> {
//   //   return await this.apollo
//   //     .query({
//   //       query: USER_DETAIL,
//   //       fetchPolicy: 'network-only'
//   //     })
//   //     .pipe(
//   //       this.notificationService.catchError(
//   //         'Profile Error'
//   //       ),
//   //       map(({data}: any) => {
//   //         if (data) {
//   //           let result: any = Object.values(data)[0];
//   //           if (result?.data) {
//   //             this.storage.setItem(
//   //               'userId',
//   //               result?.data?.id
//   //             );
//   //             this.storage.setItem('email', result?.data?.userNames);
//   //             this.storage.setItem(
//   //               'user',
//   //               result?.data?.userNames
//   //             );
//   //             this.storage.setItem(
//   //               'userType',
//   //               result?.data?.userProfileType
//   //             );
//   //
//   //             // let projects = JSON.stringify([
//   //             //   {
//   //             //     "id": "12",
//   //             //     "projectUniqueId": "21527ba6-4e47-447d-89cb-081ee4147158",
//   //             //     "projectName": "Rural broadband connectivity and rural ICT development"
//   //             //   },
//   //             //   {
//   //             //     "id": "11",
//   //             //     "projectUniqueId": "5b49f2e4-2db8-4f9f-942b-b28140c2affc",
//   //             //     "projectName": "Govnet Connectivity"
//   //             //   }
//   //             // ])
//   //
//   //             let projects = JSON.stringify(result?.data?.userProjects?.projects ?? []);
//   //
//   //             console.log("STRING FIED",  projects)
//   //
//   //             this.storage.setItem('myProjects', projects)
//   //
//   //           }
//   //         }
//   //         return data;
//   //       })
//   //     ).toPromise()
//   //
//   // }
//   //
//   // async clientTokenRequest() {
//   //   const body = `grant_type=client_credentials`;
//   //
//   //   // const headers = new HttpHeaders({
//   //   //   'Content-Type': 'application/x-www-form-urlencoded',
//   //   //   Accept: 'application/json',
//   //   //   Authorization:
//   //   //     'Basic ' +
//   //   //     btoa(environment.CLIENT_ID + ':' + environment.CLIENT_SECRET),
//   //   //   // 'Access-Control-Allow-Origin': '*',
//   //   //   // 'Access-Control-Allow-Methods': '*',
//   //   // });
//   //   //
//   //   // return await this.http
//   //   //   .post<AuthTokenModel>(
//   //   //     environment.SERVER_URL + `/nlmis-uaa/oauth/token`,
//   //   //     body,
//   //   //     {
//   //   //       headers,
//   //   //     }
//   //   //   )
//   //   //   .pipe(
//   //   //     map((response) => {
//   //   //       // login successful if there's a jwt token in the response
//   //   //       if (response && response.access_token) {
//   //   //         // store response details and jwt token in local storage to keep response logged in between page refreshes
//   //   //         this.storage.setItem('currentClient', response.access_token);
//   //   //         //  this.storage.setItem('refreshToken', response.refresh_token);
//   //   //         this.storage.setItem('expireTime', response.expires_in);
//   //   //       }
//   //   //       return response;
//   //   //     })
//   //   //   )
//   //   //   .toPromise();
//   // }
//   //
//   //
//   alreadyLoggedIn() {
//     return !!localStorage.getItem('currentClient');
//   }
  
  
//   logout(sessionExpired = false): any {
//     this.permissionsService.flushPermissions();
//     const currentClient = this.storage.getItem('currentClient');
//     const body = new HttpParams().set('token', currentClient);
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/x-www-form-urlencoded',
//       Accept: 'application/json',
//     });
//     const hasReadGuide = this.storage.getItem('hasReadGuide');
//     localStorage.clear();
//     this.storage.clearStorage();
//     this.storage.setItem('hasReadGuide', hasReadGuide);
//     if (sessionExpired) {
//       localStorage.setItem('urlToRedirect', this.router.url);
//       this.storage.setItem('sessionExpired', 'true');
//     }
//     this.router.navigate(['/login']);
//     // this.taesaRegistrationNumber$.next(undefined);
//     // this.photoUrl$.next(undefined);
//   }
  
//   async authRole() {
//     this.permissionsService.loadPermissions([]);
//     // this.perms = localStorage.getItem('currentClient');
//     // if (this.perms) {
//     //   await this.getUserDetails();
//     //   return await this.apollo
//     //     .query({
//     //       query: USER_ROLES,
//     //       fetchPolicy: 'network-only'
//     //     })
//     //     .pipe(
//     //       this.notificationService.catchError(
//     //         'Permission Error'
//     //       ),
//     //       map((data) => {
//     //         if (data) {
//     //           let result: any = Object.values(data)[0];
//     //           console.log("asdsads",result);
//     //
//     //           if (result?.getUserPermissionsList?.data) {
//     //             const finalArray = result?.getUserPermissionsList?.data?.map(
//     //               (obj: any) => {
//     //                 return obj?.permissionCode;
//     //               }
//     //             );
//     //
//     //             console.log("ghjdfhghghsf",finalArray);
//     //
//     //
//     //             this.permissionsService.loadPermissions(finalArray);
//     //           }
//     //         }
//     //         return data;
//     //       })
//     //     ).toPromise()
//     // }
//   }
//   //
//   // async fewSystemProjects() {
//   //   return await this.apollo
//   //     .query({
//   //       query: LIST_ALL_SYSTEM_PROJECTS_FEW,
//   //       fetchPolicy: 'network-only'
//   //     })
//   //     .pipe(
//   //       this.notificationService.catchError(
//   //         'Permission Error'
//   //       ),
//   //       map((data) => {
//   //         if (data) {
//   //           let result: any = Object.values(data)[0];
//   //           if (result) {
//   //             const finalArray = result?.projectsList?.map(
//   //               (obj: any) => {
//   //                 return {
//   //                   ...obj,
//   //                   name: obj?.projectName,
//   //                   route: '/project/project-settings-dashboard',
//   //                   uid: obj?.projectUniqueId
//   //                 };
//   //               }
//   //             );
//   //             return finalArray;
//   //           }
//   //         }
//   //       })
//   //     ).toPromise()
//   //
//   // }
//   //
//   //
//   // changeRole() {
//   //   const accessToken = this.storage.getItem('currentClient');
//   //   const refreshToken = this.storage.getItem('refreshToken');
//   //   if (accessToken) {
//   //     return this.http.post<any>(
//   //       environment.SERVER_URL +
//   //       `/nlmis-uaa/user/change-role?access_token='${accessToken}'&refresh_token=${refreshToken}`,
//   //       null
//   //     );
//   //   }
//   // }
//   //
//   // async updateUserRole() {
//   //   const newRole = await this.changeRole()
//   //     .pipe(
//   //       map(({data}: any) => {
//   //         this.storage.setItem('currentClient', data?.access_token);
//   //         this.storage.setItem('refreshToken', data.refresh_token);
//   //         this.storage.setItem('expireTime', data?.expires_in);
//   //         return data;
//   //       }),
//   //       first()
//   //     )
//   //     .toPromise();
//   //
//   //   // call - authRole to get permissions
//   //   console.log('New Role ', newRole);
//   //   if (newRole?.access_token) await this.authRole();
//   //   return !!newRole?.access_token;
//   // }
//   //
//   // createPassword(formData: any): Observable<any> {
//   //   return this.http.post<any>(
//   //     environment.SERVER_URL + `/nlmis-uaa/anonymous/create-password`,
//   //     formData
//   //   );
//   // }
//   //
//   // activateAccount(formData: { token: string }): Observable<any> {
//   //   return this.http.post<any>(
//   //     environment.SERVER_URL +
//   //     `/nlmis-uaa/nlmis/anonymous/activate-account?token=` +
//   //     formData.token,
//   //     formData.token
//   //   );
//   // }
//   //
//   // forgotPassword(formData: { email: string }): Observable<any> {
//   //   return this.http.post<any>(
//   //     environment.SERVER_URL +
//   //     `/nlmis-uaa/nlmis/anonymous/forget-password?email=` +
//   //     formData.email,
//   //     formData
//   //   );
//   // }
//   //
//   // collectFailedRequest(err: {
//   //   reason?: any;
//   //   status: any;
//   //   causedBy?: any;
//   //   msg: any;
//   // }): void {
//   //   this.errorCode = err.status;
//   //   if (this.errorCode === 400 && err.msg === null) {
//   //     const message = 'Wrong Credentials';
//   //     const action = 'Dismiss';
//   //     this.snackbar.open(message, action, {
//   //       duration: 5000,
//   //       verticalPosition: 'top',
//   //       panelClass: 'red-snackbar',
//   //     });
//   //   }
//   //   if (this.errorCode === 400 && err.msg !== null) {
//   //     const message = err.msg;
//   //     const action = 'Dismiss';
//   //     this.snackbar.open(message, action, {
//   //       duration: 5000,
//   //       verticalPosition: 'top',
//   //       panelClass: 'red-snackbar',
//   //     });
//   //   }
//   //   if (this.errorCode === 401) {
//   //     const action = 'Dismiss';
//   //     this.snackbar.open('Unauthorized Error', action, {
//   //       duration: 5000,
//   //       verticalPosition: 'top',
//   //       panelClass: 'red-snackbar',
//   //     });
//   //     this.logout();
//   //   }
//   //   if (this.errorCode === 404) {
//   //     const message = 'Service Temporarily Unavailable';
//   //     const action = 'Dismiss';
//   //     this.snackbar.open(message, action, {
//   //       duration: 5000,
//   //       verticalPosition: 'bottom',
//   //       panelClass: 'red-snackbar',
//   //     });
//   //   }
//   //   if (this.errorCode === 500) {
//   //     const message = 'Internal Server Error';
//   //     const action = 'Dismiss';
//   //     this.snackbar.open(message, action, {
//   //       duration: 5000,
//   //     });
//   //   }
//   //   if (this.errorCode === 504) {
//   //     const message = 'Service Temporarily Unavailable';
//   //     const action = 'Dismiss';
//   //     this.snackbar.open(message, action, {
//   //       duration: 5000,
//   //       verticalPosition: 'bottom',
//   //       panelClass: 'red-snackbar',
//   //     });
//   //   }
//   //   if (this.errorCode === 0) {
//   //     alert('0');
//   //     const message = 'Service Temporarily Unavailable';
//   //     const action = 'Dismiss';
//   //     this.snackbar.open(message, action, {
//   //       duration: 5000,
//   //       verticalPosition: 'bottom',
//   //       panelClass: 'red-snackbar',
//   //     });
//   //   }
//   // }
// }
