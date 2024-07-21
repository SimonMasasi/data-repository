import { Component, Injectable, OnInit } from '@angular/core';
import { Router  , ActivatedRoute} from '@angular/router';
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
export class VerificationComponent implements OnInit {
  verification_email: any = localStorage.getItem('verification_email');
  verification_code: string = '';
  registrationError: any;
  token:string | null | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    ){

    }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params) {
        this.token= params['token']
      } 
      else{
        this.token = ''
      }
     })

    this.authService.verifyEmail({} , this.token)
    .subscribe(
      (response) => {
        if(response.status){
          this.toastr.success("Account activated Successfully ");
          this.router.navigate(['/login']);
        }else{
          this.toastr.error(response.message);
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        console.error('Registration error:', error);
        this.toastr.error("An Error Ocurred while Activating ")
      }
    );
  }

    
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
    this.authService.verifyEmail(formData , this.token)
    .subscribe(
      (response) => {
        if(response.status){
          this.showSuccess();
          this.router.navigate(['/my-datasets']);
        }else{
          console.log('Registration failed!', response);
          this.showFailure();
          this.router.navigate([``]);
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
