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
export class PermissionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log("PermissionGuard checking route:", state.url);
    console.log("Required permissions:", route.data?.["permissions"]);

    // First check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      console.log("User is not authenticated, redirecting to login");
      this.router.navigate(["/auth/login"], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    // If permissions are required for this route
    if (route.data && route.data["permissions"]) {
      const requiredPermissions = route.data["permissions"] as Array<string>;
      const requireAll = route.data["requireAllPermissions"] === true;
      console.log("Permission check mode:", requireAll ? "ALL" : "ANY");

      let hasPermission: boolean;
      if (requireAll) {
        // Check if user has ALL the required permissions
        hasPermission = this.authService.hasAllPermissions(requiredPermissions);
      } else {
        // Check if user has ANY of the required permissions
        hasPermission = this.authService.hasAnyPermission(requiredPermissions);
      }

      console.log("User has required permissions?", hasPermission);

      if (hasPermission) {
        console.log("Access granted: User has required permissions");
        return true;
      } else {
        // If admin, still allow access
        const isAdmin = this.authService.isAdmin();
        console.log("Is user admin?", isAdmin);

        if (isAdmin) {
          console.log("Access granted: User is admin");
          return true;
        }
        // Otherwise redirect to unauthorized page or dashboard
        console.log("Access denied: User lacks permissions and is not admin");
        this.router.navigate(["/dashboard"]);
        return false;
      }
    }

    // If no permissions required, allow access
    console.log("No permissions required for this route, access granted");
    return true;
  }
}
