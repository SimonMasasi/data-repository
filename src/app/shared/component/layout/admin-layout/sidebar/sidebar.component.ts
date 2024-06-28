import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  open: boolean = true;
  constructor(
    private router: Router,  
    private toastr: ToastrService,
    private authService: AuthService,
  ) {
    this.open = window.innerWidth >= 768;
  }
  user = this.authService.getUser();
  @HostListener('window:resize')
  onResize() {
    this.open = window.innerWidth >= 768;
  }

  showSuccess() {
    this.toastr.info('Logout successfully successfully', 'logout info');
  }

  closeBtn() {
    this.open = !this.open;
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
