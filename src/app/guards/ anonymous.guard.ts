import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AnonymousGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private storage: StorageService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.auth.alreadyLoggedIn()) {
      return true;
    } else {
      return     this.router.navigateByUrl('/dtpms-landing');
    }
  }
}
