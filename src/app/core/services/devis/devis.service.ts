import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Devis } from "../../models/devis";

@Injectable({
  providedIn: "root",
})
export class DevisService {
  private readonly BASE_URL = `${environment.apiUrl}/devis`;

  constructor(private http: HttpClient) {}

  getDevisList(): Observable<any> {
    return this.http.get<any>(this.BASE_URL);
  }

  getRecentDevis(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/recent`);
  }

  getDevisById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  getDevisByNumero(numeroDevis: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/numero/${numeroDevis}`);
  }

  getDevisByClient(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/client/${clientId}`);
  }

  getDevisByProspect(prospectId: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/prospect/${prospectId}`);
  }

  getDevisBySujet(sujet: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/sujet/${sujet}`);
  }

  createDevis(devis: Devis): Observable<any> {
    return this.http.post<any>(this.BASE_URL, devis);
  }

  updateDevis(id: number, devis: Devis): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${id}`, devis);
  }

  deleteDevis(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }

  addLigneDevis(devisId: number, ligneDevis: any): Observable<any> {
    return this.http.post<any>(
      `${this.BASE_URL}/${devisId}/lignes`,
      ligneDevis
    );
  }

  removeLigneDevis(devisId: number, ligneId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.BASE_URL}/${devisId}/lignes/${ligneId}`
    );
  }

  calculateTotals(devisId: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/${devisId}/calculate`, {});
  }
}
