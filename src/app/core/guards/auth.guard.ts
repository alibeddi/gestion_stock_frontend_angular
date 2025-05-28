import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth/auth.service";

@Injectable({
  providedIn: "root",
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
    console.log(
      "AuthGuard: Checking if user is authenticated for route",
      state.url
    );

    if (this.authService.isAuthenticated()) {
      console.log("AuthGuard: User is authenticated");

      // If route has data with roles, check user has required role
      if (route.data && route.data["roles"]) {
        const requiredRoles = route.data["roles"] as Array<string>;
        console.log("AuthGuard: Route requires roles:", requiredRoles);

        // Special case for ADMIN role
        if (requiredRoles.includes("ADMIN") && this.authService.isAdmin()) {
          console.log("AuthGuard: User is ADMIN, access granted");
          return true;
        }

        // Check other roles
        const hasRole = requiredRoles.some((role) =>
          this.authService.hasRole(role)
        );

        console.log("AuthGuard: User has required role?", hasRole);

        if (hasRole) {
          return true;
        } else {
          // If user doesn't have required role, redirect to dashboard
          console.log(
            "AuthGuard: User does not have required role, redirecting to dashboard"
          );
          this.router.navigate(["/dashboard"]);
          return false;
        }
      }

      // If no specific roles required but authenticated, proceed
      return true;
    }

    // If not authenticated, redirect to login
    console.log("AuthGuard: User is not authenticated, redirecting to login");
    this.router.navigate(["/auth/login"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
