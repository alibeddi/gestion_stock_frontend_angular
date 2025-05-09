import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Role } from "../../models/role";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private readonly BASE_URL = "/api/roles";

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}`);
  }

  getRoleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  getRoleByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/name/${name}`);
  }

  createRole(role: Role): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}`, role);
  }

  updateRole(id: number, role: Role): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${id}`, role);
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }
}
