import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isDropdownOpen: boolean = false;

  constructor(
    private authService:AuthService,
    private toastr: ToastrService,
    private router: Router
  ){}
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  showSuccess() {
    this.toastr.info('Logout successfully successfully', 'logout info');
  }

  logout() {
    this.authService.logout().subscribe(
      () => {
        this.authService.removeToken();
        this.showSuccess()
        this.router.navigate(['/login']); // Redirect to login page after logout
      },
      (error: any) => {
        console.error('Logout error:', error);
      }
    );
  }
}
