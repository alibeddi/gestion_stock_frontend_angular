import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SourceProspection } from "../../models/source-prospection";

@Injectable({
  providedIn: "root",
})
export class SourceProspectionService {
  private readonly BASE_URL = "/api/sources-prospection";

  constructor(private http: HttpClient) {}

  getAllSources(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}`);
  }

  getSourceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  getSourceByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/code/${code}`);
  }

  createSource(source: SourceProspection): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}`, source);
  }

  updateSource(id: number, source: SourceProspection): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${id}`, source);
  }

  deleteSource(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }
}
