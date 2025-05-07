import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isAuthenticated()) {
      // If route has data with roles, check user has required role
      if (route.data && route.data['roles']) {
        const requiredRoles = route.data['roles'] as Array<string>;
        const hasRole = requiredRoles.some((role) =>
          this.authService.hasRole(role)
        );

        if (hasRole) {
          return true;
        } else {
          // If user doesn't have required role, redirect to dashboard
          this.router.navigate(['/dashboard']);
          return false;
        }
      }

      // If no specific roles required but authenticated, proceed
      return true;
    }

    // If not authenticated, redirect to login
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
