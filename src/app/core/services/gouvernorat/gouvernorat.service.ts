import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Gouvernorat } from "../../models/gouvernorat";

@Injectable({
  providedIn: "root",
})
export class GouvernoratService {
  private readonly BASE_URL = "/api/gouvernorats";

  constructor(private http: HttpClient) {}

  getAllGouvernorats(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}`);
  }

  getGouvernoratById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  getGouvernoratByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/code/${code}`);
  }

  createGouvernorat(gouvernorat: Gouvernorat): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}`, gouvernorat);
  }

  updateGouvernorat(id: number, gouvernorat: Gouvernorat): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${id}`, gouvernorat);
  }

  deleteGouvernorat(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }
}
