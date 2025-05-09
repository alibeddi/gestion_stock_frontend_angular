import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SecteurActivite } from "../../models/secteur-activite";

@Injectable({
  providedIn: "root",
})
export class SecteurActiviteService {
  private readonly BASE_URL = "/api/secteurs-activite";

  constructor(private http: HttpClient) {}

  getAllSecteurs(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}`);
  }

  getSecteurById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  getSecteurByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/code/${code}`);
  }

  createSecteur(secteur: SecteurActivite): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}`, secteur);
  }

  updateSecteur(id: number, secteur: SecteurActivite): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${id}`, secteur);
  }

  deleteSecteur(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }
}
