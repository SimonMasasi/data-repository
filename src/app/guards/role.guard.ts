import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRolesString = localStorage.getItem('roles');
    
    if (userRolesString === null) {
      // Handle the case where userRolesString is null
      return false;
    }
    
    const userRoles: string[] = JSON.parse(userRolesString);
    const allowedRoles = route.data['allowedRoles'] as string[];
  
    if (userRoles && allowedRoles) {
      // Check if user has any of the allowed roles
      const hasRole = userRoles.some(role => allowedRoles.includes(role));
      if (hasRole) {
        return true;
      }
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
  
}
