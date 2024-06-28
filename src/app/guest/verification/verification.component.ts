import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.scss'
})
export class VerificationComponent {
  verification_email: any = localStorage.getItem('verification_email');
  verification_code: string = '';
  registrationError: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
    ){}
    onChange(event: any){
      this.verification_code=event.target.values;
    }
    showSuccess() {
      this.toastr.success('Verification successfully now you can login!', 'verification status');
    }

    showFailure() {
      this.toastr.info('Verification Failed please verify again', 'verification status');
    }

  onSubmit() {
    const formData = new FormData();
    formData.append('verification_code', 'oPZIc4');
    formData.append('email', this.verification_email);
    
    this.authService.verifyEmail(formData)
    .subscribe(
      (response) => {
        if(response.message=="success"){
          console.log('Registration successful!', response);
          this.showSuccess();
          this.router.navigate(['/login']);
        }else{
          console.log('Registration failed!', response);
          this.showFailure();
          this.router.navigate(['/verification']);
        }
      },
      (error) => {
        console.error('Registration error:', error);
        this.registrationError = 'Registration failed. Please try again.';
      }
    );
  }
  resendCode() {
    throw new Error('Method not implemented.');
  }

}
