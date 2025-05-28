import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export interface Permission {
  id?: number;
  name: string;
  description?: string;
  category?: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: "root",
})
export class PermissionService {
  private readonly API_URL = `${environment.apiUrl}/permissions`;

  constructor(private http: HttpClient) {}

  getAllPermissions(): Observable<ApiResponse<Permission[]>> {
    return this.http.get<ApiResponse<Permission[]>>(this.API_URL);
  }

  getPermissionById(id: number): Observable<ApiResponse<Permission>> {
    return this.http.get<ApiResponse<Permission>>(`${this.API_URL}/${id}`);
  }

  getPermissionByName(name: string): Observable<ApiResponse<Permission>> {
    return this.http.get<ApiResponse<Permission>>(
      `${this.API_URL}/name/${name}`
    );
  }

  getPermissionsByCategory(
    category: string
  ): Observable<ApiResponse<Permission[]>> {
    return this.http.get<ApiResponse<Permission[]>>(
      `${this.API_URL}/category/${category}`
    );
  }

  searchPermissions(name: string): Observable<ApiResponse<Permission[]>> {
    return this.http.get<ApiResponse<Permission[]>>(
      `${this.API_URL}/search?name=${name}`
    );
  }

  createPermission(
    permission: Permission
  ): Observable<ApiResponse<Permission>> {
    return this.http.post<ApiResponse<Permission>>(this.API_URL, permission);
  }

  updatePermission(
    id: number,
    permission: Permission
  ): Observable<ApiResponse<Permission>> {
    return this.http.put<ApiResponse<Permission>>(
      `${this.API_URL}/${id}`,
      permission
    );
  }

  deletePermission(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }

  initializeDefaultPermissions(): Observable<ApiResponse<Permission[]>> {
    return this.http.post<ApiResponse<Permission[]>>(
      `${this.API_URL}/init`,
      {}
    );
  }
}
