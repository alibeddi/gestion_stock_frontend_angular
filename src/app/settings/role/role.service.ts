import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Permission } from "../permission/permission.service";

export interface Role {
  id?: number;
  name: string;
  libelle?: string;
  permissions?: Permission[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(this.apiUrl);
  }

  getRoleById(id: number): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`);
  }

  getRoleByName(name: string): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/name/${name}`);
  }

  createRole(role: Role): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(this.apiUrl, role);
  }

  updateRole(id: number, role: Role): Observable<ApiResponse<Role>> {
    return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getRolePermissions(roleId: number): Observable<ApiResponse<Permission[]>> {
    return this.http.get<ApiResponse<Permission[]>>(
      `${this.apiUrl}/${roleId}/permissions`
    );
  }

  assignPermissionsToRole(
    roleId: number,
    permissionIds: number[]
  ): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(
      `${this.apiUrl}/${roleId}/permissions`,
      permissionIds
    );
  }

  removePermissionsFromRole(
    roleId: number,
    permissionIds: number[]
  ): Observable<ApiResponse<Role>> {
    return this.http.delete<ApiResponse<Role>>(
      `${this.apiUrl}/${roleId}/permissions`,
      {
        body: permissionIds,
      }
    );
  }
}
