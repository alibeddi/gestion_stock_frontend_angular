import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Emballage } from "../../models/emballage";

@Injectable({
  providedIn: "root",
})
export class EmballageService {
  private readonly BASE_URL = "/api/emballages";

  constructor(private http: HttpClient) {}

  getAllEmballages(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}`);
  }

  getEmballageById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  getEmballageByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/code/${code}`);
  }

  createEmballage(emballage: Emballage): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}`, emballage);
  }

  updateEmballage(id: number, emballage: Emballage): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${id}`, emballage);
  }

  deleteEmballage(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }
}
