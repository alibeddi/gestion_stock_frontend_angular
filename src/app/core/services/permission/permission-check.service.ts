import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class PermissionCheckService {
  // For development purposes - set to false to enable actual permission checks
  private devMode = false;

  // Map of features to required permissions
  private featurePermissions: { [key: string]: string[] } = {
    // User management
    "users.view": ["users:read"],
    "users.create": ["users:create"],
    "users.edit": ["users:update"],
    "users.delete": ["users:delete"],

    // Client management
    "clients.view": ["clients:read"],
    "clients.create": ["clients:create"],
    "clients.edit": ["clients:update"],
    "clients.delete": ["clients:delete"],

    // Prospect management
    "prospects.view": ["prospects:read"],
    "prospects.create": ["prospects:create"],
    "prospects.edit": ["prospects:update"],
    "prospects.delete": ["prospects:delete"],

    // Product management
    "products.view": ["products:read"],
    "products.create": ["products:create"],
    "products.edit": ["products:update"],
    "products.delete": ["products:delete"],

    // Quote management
    "quotes.view": ["quotes:read"],
    "quotes.create": ["quotes:create"],
    "quotes.edit": ["quotes:update"],
    "quotes.delete": ["quotes:delete"],

    // Settings
    "settings.view": ["settings:read"],
    "settings.update": ["settings:update"],

    // Roles
    "roles.view": ["roles:read"],
    "roles.manage": ["roles:create", "roles:update", "roles:delete"],
  };

  constructor(private authService: AuthService) {}

  /**
   * Check if the current user can access a specific feature
   * @param featureKey The key of the feature to check
   * @returns true if the user has permission, false otherwise
   */
  canAccess(featureKey: string): boolean {
    // In development mode, always allow access
    if (this.devMode) {
      console.log(`[DEV MODE] Access granted to feature: ${featureKey}`);
      return true;
    }

    // Always allow admin access
    if (this.authService.isAdmin()) {
      return true;
    }

    // Get required permissions for the feature
    const requiredPermissions = this.featurePermissions[featureKey];

    // If feature doesn't exist in our map, deny access
    if (!requiredPermissions) {
      console.warn(`Feature "${featureKey}" not defined in permission map`);
      return false;
    }

    // Check if user has any of the required permissions
    return this.authService.hasAnyPermission(requiredPermissions);
  }

  /**
   * Check if current user has all the specified permissions
   * @param permissions List of permissions to check
   * @returns true if the user has all permissions, false otherwise
   */
  hasAllPermissions(permissions: string[]): boolean {
    // In development mode, always allow access
    if (this.devMode) {
      return true;
    }
    return this.authService.hasAllPermissions(permissions);
  }

  /**
   * Check if current user has any of the specified permissions
   * @param permissions List of permissions to check
   * @returns true if the user has any permission, false otherwise
   */
  hasAnyPermission(permissions: string[]): boolean {
    // In development mode, always allow access
    if (this.devMode) {
      return true;
    }
    return this.authService.hasAnyPermission(permissions);
  }
}
