import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRole = route.data['role'];  // Get the required role from the route data

    // Check if the user is authenticated and has the required role
    if (this.authService.isAutenticated && this.authService.roles.includes(requiredRole)) {
      return true;
    } else {
      // Redirect to not authorized page if the user doesn't have access
      this.router.navigateByUrl("/admin/notAuthorized");
      return false;
    }
  }
}

