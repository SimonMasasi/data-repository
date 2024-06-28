import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ResponseCodeService } from './response-code.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private router: Router,
    private responseCodeService: ResponseCodeService
  ) {}

  successMessage(message: string, timer = 3000) {
    return Swal.fire({
      title: message,
      text: '',
      icon: 'success',
      allowOutsideClick: true,
      toast: true,
      position: 'bottom-right',
      showConfirmButton: true,
      timerProgressBar: true,
      padding: '20px',
      timer,
    });
  }

  errorMessage(message: string) {
    return Swal.fire({
      title: message,
      text: '',
      icon: 'error',
      allowOutsideClick: true,
      toast: true,
      position: 'bottom-right',
      showConfirmButton: false,
      timerProgressBar: true,
      padding: '20px',
      timer: 3000,
    });
  }

  noErrorCode() {
    return Swal.fire({
      title: 'Unknown Error Code Returned',
      text: '',
      icon: 'error',
      position: 'bottom-right',
      allowOutsideClick: false,
    });
  }

  catchError(message: string) {
    return catchError((error) => {
      Swal.fire({
        icon: 'error',
        text: message,
        allowOutsideClick: true,
        toast: true,
        position: 'bottom-right',
        showConfirmButton: false,
        timerProgressBar: true,
        padding: '20px',
        timer: 3000,
      });
      return error;
      // return of([]);
    });
  }

  confirmation(
    message: string = 'Are you sure?',
    confirmButtonText: string = 'Yes'
  ) {
    return Swal.fire({
      title: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText,
      allowOutsideClick: false,
    });
  }

  async successMessageWithRedirect(message: string, route: string) {
    const response = await Swal.fire({
      title: message,
      text: '',
      icon: 'success',
      allowOutsideClick: false,
    });
    if (response) {
      return this.router.navigate([route]);
    }
    return false;
  }

  warningMessage(message: string) {
    return Swal.fire({
      title: message,
      text: '',
      icon: 'warning',
      allowOutsideClick: false,
    });
  }

  handleErrorMessage(data: any) {
    const responseCode = this.responseCodeService.getCodeDescription(
      data?.code
    );
    const message =
      responseCode[0]?.code + ' : ' + responseCode[0]?.description;
    return this.errorMessage(message);
  }

  async warningMessageWithRedired(message: string, route: string) {
    const response = await Swal.fire({
      title: message,
      text: '',
      icon: 'warning',
      allowOutsideClick: false,
    });
    if (response) {
      return this.router.navigate([route]);
    }
    return false;
  }
}
