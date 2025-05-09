import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { LoginRequest } from "../../models/auth/login-request";
import { RegisterRequest } from "../../models/auth/register-request";
import { TokenService } from "../token/token.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly BASE_URL = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/login`, loginRequest).pipe(
      tap((response) => {
        if (response && response.data) {
          this.tokenService.saveToken(response.data.accessToken);
          this.tokenService.saveUser(response.data);
        }
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

  getCurrentUser(): any {
    return this.tokenService.getUser();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) {
      return false;
    }
    return user.roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole("ADMIN");
  }

  isManager(): boolean {
    return this.hasRole("MANAGER");
  }
}
