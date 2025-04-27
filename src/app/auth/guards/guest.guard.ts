import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    
    if (!this.authService.isAuthenticated()) {
      return true; // Allow access for guests
    }

    // Redirect authenticated users to dashboard/home
    return this.router.parseUrl('/dashboard'); 
    // Or use createUrlTree if you need query params:
    // return this.router.createUrlTree(['/dashboard']);
  }
}