// password-change.component.ts
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {
  changePasswordForm = {
    oldPassword: '',
    newPassword: ''
  };
  isSubmitting = false;
  error='';

  constructor(private authService: AuthService) { }

  onSubmit(): void {
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      const { oldPassword, newPassword } = this.changePasswordForm;
      this.authService.changePassword(oldPassword, newPassword).subscribe(
        () => {
          this.isSubmitting = false;
          // Handle success message or redirection here
        },
        (        error: string) => {
          this.isSubmitting = false;
          this.error = error;
          // Handle error message here
        }
      );
    }
  }
}
