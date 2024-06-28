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
  errorMessage: any;

constructor(private authService:AuthService, private router:Router, private http: HttpClient, private toastr: ToastrService){}
showSuccess() {
  this.toastr.success('Registration successfully now you can login!', 'registration status dialogue');
}
showFailure() {
  this.toastr.error('Registration please the valid data', 'registration status dialogue');
}
onSubmit() {
  // Validate form data (since we're not using FormBuilder)
  if (!this.email || !this.firstName || !this.lastName || !this.password || this.password !== this.confirmPassword) {
    this.registrationError = 'Please fill in all fields correctly.';
    this.showFailure()
    return;
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
      console.error('Registration error:', error);
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
