import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrl: './full-layout.component.scss'
})
export class FullLayoutComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}
ngOnInit(): void {
  const hasAdminRole=this.authService.hasRole("Admin");
  if(!hasAdminRole){
    this.router.navigate(['/unauthorized']);
  }
}
}
