import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  confirmPassword: string = '';
  registrationError: string = '';
  emailErrors :string|null = null;
  errorMessage: any;
  passwordErrors :any;
  confirmPasswordErrors :any;

constructor(private authService:AuthService, private router:Router, private http: HttpClient, private toastr: ToastrService){}
showSuccess() {
  this.toastr.success('Registration successfully now you can login!', 'registration status dialogue');
}
showFailure() {
  this.toastr.error('Registration please the valid data', 'registration status dialogue');
}

validateEmail(email:string){
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


onFocusOutEvent(event: any){
  if(!this.validateEmail(this.email)){
    this.emailErrors = "invalid email address"
    return
  } 
  this.emailErrors =null
  return
}


validatePassword1() {
  var p = this.password,
      errors = [];
  if (p.length < 8) {
      errors.push("Your password must be at least 8 characters"); 
  }
  if (p.search(/[a-z]/i) < 0) {
      errors.push("Your password must contain at least one letter.");
  }
  if (p.search(/[0-9]/) < 0) {
      errors.push("Your password must contain at least one digit."); 
  }
  this.passwordErrors = errors
  if (errors.length > 0) {
      return false;
  }
  return true;
}


validatePassword2() {
  var p = this.confirmPassword,
      errors = [];
  if (p.length < 8) {
      errors.push("Your password must be at least 8 characters"); 
  }
  if (p.search(/[a-z]/i) < 0) {
      errors.push("Your password must contain at least one letter.");
  }
  if (p.search(/[0-9]/) < 0) {
      errors.push("Your password must contain at least one digit."); 
  }
  this.confirmPasswordErrors = errors
  if (errors.length > 0) {
      return false;
  }
  return true;
}


onSubmit() {
  // Validate form data (since we're not using FormBuilder)
  if (!this.email || !this.firstName || !this.lastName || !this.password || this.password !== this.confirmPassword) {
    this.registrationError = 'Please fill in all fields correctly.';
    this.toastr.error('Please fill in all empty Fields.')
    return;
  }

  if(!this.validateEmail(this.email)){
    this.emailErrors = "invalid email address"
    return
  } 

  const formData = {
    email: this.email,
    first_name: this.firstName,
    last_name: this.lastName,
    password: this.password,
  };
  
  this.authService.registerUser(formData)
  .subscribe(
    (response) => {
      console.log('Registration successful!', response);
      this.showSuccess();
      this.router.navigate(['/login']);
    },
    (error) => {
      console.error('Registration error:', error.error);

      if (error?.error){
        if(error?.error.email)
          this.toastr.error(error?.error.email[0])
          return;
      }
      this.registrationError = 'Registration failed. Please try again.';
    }
  );
}

ngOnInit(): void {
  if(this.authService.isLoggedIn()){
    this.router.navigate(['/datasets-list']);

}
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  
}
}
