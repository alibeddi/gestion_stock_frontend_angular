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
import { PermissionCheckService } from "../services/permission/permission-check.service";

@Injectable({
  providedIn: "root",
})
export class FeatureAccessGuard implements CanActivate {
  constructor(
    private permissionService: PermissionCheckService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log("FeatureAccessGuard checking route:", state.url);

    // If feature is not specified in route data, allow access
    if (!route.data || !route.data["requiredFeature"]) {
      console.log("No feature requirement specified, access granted");
      return true;
    }

    // Admin users always have access to all features
    if (this.authService.isAdmin()) {
      console.log("User is admin, access granted");
      return true;
    }

    const requiredFeature = route.data["requiredFeature"] as string;
    console.log("Required feature for route:", requiredFeature);

    // Check if user has access to the feature
    const hasAccess = this.permissionService.canAccess(requiredFeature);
    console.log(`Access to feature "${requiredFeature}": ${hasAccess}`);

    if (hasAccess) {
      return true;
    }

    // If access denied, redirect to dashboard
    console.log("Access denied, redirecting to dashboard");
    return this.router.createUrlTree(["/dashboard"]);
  }
}
