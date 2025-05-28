import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { LoginRequest } from "../../models/auth/login-request";
import { RegisterRequest } from "../../models/auth/register-request";
import { ApiService } from "../api.service";
import { TokenService } from "../token/token.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly BASE_URL = "http://localhost:8080/api/auth";
  private baseUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private apiService: ApiService
  ) {}

  login(loginRequest: LoginRequest): Observable<any> {
    console.log("Attempting login with email:", loginRequest.email);

    return this.http.post<any>(`${this.BASE_URL}/login`, loginRequest).pipe(
      tap({
        next: (response) => {
          console.log("Login response:", response);
          if (response && response.data) {
            console.log("Auth data:", response.data);
            console.log("Authorities:", response.data.authorities);
            this.tokenService.saveToken(response.data.accessToken);
            this.tokenService.saveUser(response.data);
          } else {
            console.warn("Login response missing data field:", response);
          }
        },
        error: (error) => {
          console.error("Login error details:", error);
          console.error("Error status:", error.status);
          console.error("Error message:", error.message);
          console.error("Error response:", error.error);
        },
      })
    );
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    // Remove username if it's not expected by the backend
    // and ensure we're sending exactly what the backend expects
    const requestData = {
      nom: registerRequest.nom,
      prenom: registerRequest.prenom,
      matricule: registerRequest.matricule,
      password: registerRequest.password,
      confirmPassword: registerRequest.confirmPassword,
      email: registerRequest.email,
      telephone: registerRequest.telephone,
      mobile: registerRequest.mobile,
      titre: registerRequest.titre,
      adresse: registerRequest.adresse,
      roles: registerRequest.roles,
      // username field removed
    };

    return this.http.post<any>(`${this.BASE_URL}/register`, requestData);
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/logout`, {}).pipe(
      tap(() => {
        this.tokenService.clearToken();
        this.tokenService.clearUser();
      })
    );
  }

  isAuthenticated(): boolean {
    return this.tokenService.getToken() !== null;
  }

  // Get the cached user data from token service
  getCachedUser(): any {
    return this.tokenService.getUser();
  }

  // Make an API call to get the current user data
  getCurrentUser(): Observable<any> {
    return this.apiService.get<any>(`${this.baseUrl}/users/me`);
  }

  hasRole(role: string): boolean {
    const user = this.getCachedUser();
    console.log("hasRole check for:", role);
    console.log("User data:", user);
    if (!user || !user.roles) {
      console.log("No user or roles found");
      return false;
    }
    const result = user.roles.includes(role);
    console.log(`User ${result ? "has" : "does not have"} role: ${role}`);
    return result;
  }

  hasPermission(permission: string): boolean {
    const user = this.getCachedUser();
    console.log("hasPermission check for:", permission);
    console.log("User authorities:", user?.authorities);
    if (!user || !user.authorities) {
      console.log("No user or authorities found");
      return false;
    }
    const result = user.authorities.includes(permission);
    console.log(
      `User ${result ? "has" : "does not have"} permission: ${permission}`
    );
    return result;
  }

  hasAnyPermission(permissions: string[]): boolean {
    if (!permissions || permissions.length === 0) {
      console.log("No permissions required, returning true");
      return true; // If no permissions required, return true
    }

    console.log("Checking any permissions:", permissions);
    const result = permissions.some((permission) =>
      this.hasPermission(permission)
    );
    console.log(
      `User ${result ? "has" : "does not have"} any of the required permissions`
    );
    return result;
  }

  hasAllPermissions(permissions: string[]): boolean {
    if (!permissions || permissions.length === 0) {
      console.log("No permissions required, returning true");
      return true; // If no permissions required, return true
    }

    console.log("Checking all permissions:", permissions);
    const result = permissions.every((permission) =>
      this.hasPermission(permission)
    );
    console.log(
      `User ${result ? "has" : "does not have"} all required permissions`
    );
    return result;
  }

  isAdmin(): boolean {
    const user = this.getCachedUser();
    console.log("Checking if user is admin:", user);

    if (!user) {
      console.log("No user data found");
      return false;
    }

    // Try different ways to identify an admin
    // Check if roles is an array
    let hasAdminRole = false;
    if (Array.isArray(user.roles)) {
      hasAdminRole = user.roles.some(
        (role: any) =>
          role === "ADMIN" ||
          role === "ROLE_ADMIN" ||
          (typeof role === "object" &&
            role.name &&
            (role.name === "ADMIN" || role.name === "ROLE_ADMIN"))
      );
    }
    // Check if roles is a string
    else if (typeof user.roles === "string") {
      hasAdminRole = user.roles.includes("ADMIN");
    }
    console.log("Has admin role in array/object?", hasAdminRole);

    // Check if 'roles' field is a comma-separated string
    const rolesStr = String(user.roles || "");
    const hasAdminRoleInString = rolesStr.includes("ADMIN");
    console.log("Has admin role in string?", hasAdminRoleInString);

    // Check authorities array for admin permissions
    const hasAdminAuth =
      user.authorities &&
      Array.isArray(user.authorities) &&
      user.authorities.some(
        (auth: string) => auth.includes("ADMIN") || auth === "ROLE_ADMIN"
      );
    console.log("Has admin authority?", hasAdminAuth);

    const result = hasAdminRole || hasAdminRoleInString || hasAdminAuth;
    console.log(`User ${result ? "is" : "is not"} an admin`);
    return result;
  }

  isManager(): boolean {
    return this.hasRole("MANAGER");
  }

  changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.apiService.post<any>(
      `${this.baseUrl}/auth/change-password`,
      passwordData
    );
  }
}
