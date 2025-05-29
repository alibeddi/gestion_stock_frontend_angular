import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, map, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "../core/services/auth/auth.service";
import { Permission } from "../settings/permission/permission.service";

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  matricule: string | null;
  username: string;
  email: string;
  role: string;
  roles: Array<{
    id: number;
    name: string;
    libelle: string;
  }>;
  telephone?: string;
  mobile?: string;
  titre?: string;
  adresse?: string;
  enabled?: boolean;
}

@Injectable({ providedIn: "root" })
export class UserService {
  private BASE_URL = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private handleError(error: HttpErrorResponse) {
    console.error("API Error:", error);

    if (error.status === 401) {
      console.log("Authentication error - redirecting to login");
      // Optional: Clear auth tokens
      // this.authService.logout();
      this.router.navigate(["/auth/login"]);
    }

    return throwError(() => error);
  }

  getUsers(): Observable<User[]> {
    console.log("UserService: Fetching users from", this.BASE_URL);

    return this.http.get<any>(this.BASE_URL).pipe(
      map((response) => {
        console.log("UserService: Raw API response:", response);

        // Handle different response formats
        if (Array.isArray(response)) {
          console.log("UserService: Response is a direct array");
          return response;
        } else if (response && response.data && Array.isArray(response.data)) {
          console.log("UserService: Response has data array property");
          return response.data;
        } else if (
          response &&
          response.content &&
          Array.isArray(response.content)
        ) {
          console.log("UserService: Response has content array property");
          return response.content;
        } else {
          console.error("UserService: Unexpected response format", response);
          return [];
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  getUser(id: number): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.BASE_URL}/${id}`)
      .pipe(map((response) => response.data));
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(this.BASE_URL, user)
      .pipe(map((response) => response.data));
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(`${this.BASE_URL}/${id}`, user)
      .pipe(map((response) => response.data));
  }

  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.BASE_URL}/${id}`)
      .pipe(map((response) => response.data));
  }

  getUserPermissions(userId: number): Observable<ApiResponse<Permission[]>> {
    return this.http.get<ApiResponse<Permission[]>>(
      `${this.BASE_URL}/${userId}/permissions`
    );
  }

  assignPermissionsToUser(
    userId: number,
    permissionIds: number[]
  ): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${this.BASE_URL}/${userId}/permissions`,
      permissionIds
    );
  }

  removePermissionsFromUser(
    userId: number,
    permissionIds: number[]
  ): Observable<ApiResponse<User>> {
    return this.http.delete<ApiResponse<User>>(
      `${this.BASE_URL}/${userId}/permissions`,
      {
        body: permissionIds,
      }
    );
  }
}
