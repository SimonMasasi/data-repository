import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatasetService } from 'src/app/services/dataset.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

interface User{
  username: string
}
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})

export class NavBarComponent {
  isDropdownOpen: boolean = false;
  isAccountsDropdownOpen: boolean = false;
  user: any;
  hasDashboard=false;

  constructor(
    private authService:AuthService, 
    private router: Router, 
    private datasetService:DatasetService, 
    private toastr: ToastrService,
    private userService: UserService
    ){}

  showSuccess() {
    this.toastr.info('Logout successfully successfully', 'logout info');
  }

  ngOnInit(): void {
    this.hasDashboard = this.userService.checkIfFullLayoutLoaded();
    console.log(this.hasDashboard+"No***********");
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData); // Parse the user data from JSON format
    }
  }
  isLoggedIn(){
    return this.authService.isLoggedIn();
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

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

// @HostListener('document:click', ['$event'])
// closeDropdown(event: MouseEvent) {
//   // Check if event.target is truthy before accessing its properties
//   if (event.target && !(event.target as HTMLElement).closest('.dropdown-container')) {
//     this.isAccountsDropdownOpen = false; // Close the dropdown
//   }
// }


toggleAccountsDropdown(event: Event) {
  event.preventDefault(); // Prevent default anchor behavior
  this.isAccountsDropdownOpen = !this.isAccountsDropdownOpen;
}
  // toggleAccountsDropdown() {
  //   this.isAccountsDropdownOpen = !this.isAccountsDropdownOpen;
  // }
 
  
}
