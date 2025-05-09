import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Prospect } from "../../models/prospect";

@Injectable({
  providedIn: "root",
})
export class ProspectService {
  private readonly BASE_URL = "/api/prospects";

  constructor(private http: HttpClient) {}

  getProspects(
    page: number = 0,
    size: number = 10,
    sort: string = "dateCreation,desc",
    search?: string,
    statut?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sort", sort);

    if (search) {
      params = params.set("search", search);
    }

    if (statut) {
      params = params.set("statut", statut);
    }

    return this.http.get<any>(this.BASE_URL, { params });
  }

  getProspectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  getProspectByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/code/${code}`);
  }

  getProspectsBySource(sourceId: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/source/${sourceId}`);
  }

  getProspectsByStatus(statut: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/statut/${statut}`);
  }

  createProspect(prospect: Prospect): Observable<any> {
    return this.http.post<any>(this.BASE_URL, prospect);
  }

  updateProspect(id: number, prospect: Prospect): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${id}`, prospect);
  }

  deleteProspect(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }

  convertToClient(id: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/${id}/convert`, {});
  }
}
