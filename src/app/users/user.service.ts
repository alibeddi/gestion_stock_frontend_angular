import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../environments/environment";
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

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<ApiResponse<User[]>>(this.BASE_URL)
      .pipe(map((response) => response.data));
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
