import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

interface LoginCredentials {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss'
})
export class VerifyComponent implements OnInit {
  credentials: LoginCredentials = { username: '', password: '' };
  errorMessage: string = '';
  emailErrors :string|null =null;

  constructor(
      private authService: AuthService,
      private router: Router,
      private toastr: ToastrService,
     ) { }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
        this.router.navigate(['/datasets-list']);
    }
  }

  showSuccess() {
    this.toastr.success('Login successfully ', 'login status dialogue');
  }

  validateEmail(email:string){
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


  showLoginInfo() {
    this.toastr.error('Login Failed Check your login infos ', 'login status dialogue');
  }
  showFailure() {
    this.toastr.error('login failed please enter the valid data', 'login status dialogue');
  }


  onFocusOutEvent(event: any){
    if(!this.validateEmail(this.credentials.username)){
      this.emailErrors = "invalid email address"
      return
    } 
    this.emailErrors =null
    return
 }
  onSubmit() {

    this.authService.Verify(this.credentials.username)
      .subscribe((response)=>{
          if(response.error){
            this.toastr.error(response.error);
            return;
          }
          this.toastr.success("account verified you can now login ");
        
          this.router.navigate(['/login']);
       },       
      );
  }
}
