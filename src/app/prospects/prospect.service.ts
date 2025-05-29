import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prospect, ProspectFilter } from '../core/models/prospect';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProspectService {
  
  private readonly API_URL = `${environment.apiUrl}/prospects`;
  constructor(private http: HttpClient) { }

  getProspects(filter?: ProspectFilter, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter) {
      if (filter.nom) params = params.set('nom', filter.nom);
      if (filter.matriculeFiscale) params = params.set('matriculeFiscale', filter.matriculeFiscale);
      if (filter.email) params = params.set('email', filter.email);
      if (filter.secteurActivite) params = params.set('secteurActivite', filter.secteurActivite);
      if (filter.sourceProspection) params = params.set('sourceProspection', filter.sourceProspection);
      if (filter.statut) params = params.set('statut', filter.statut);
      if (filter.potentiel) params = params.set('potentiel', filter.potentiel);
      if (filter.responsableProspection) params = params.set('responsableProspection', filter.responsableProspection);
    }

    return this.http.get<any>(this.API_URL, { params });
  }

  getProspectById(id: number): Observable<Prospect> {
    return this.http.get<Prospect>(`${this.API_URL}/${id}`);
  }

  createProspect(prospect: Prospect): Observable<Prospect> {
    return this.http.post<Prospect>(this.API_URL, prospect);
  }

  updateProspect(id: number, prospect: Prospect): Observable<Prospect> {
    return this.http.put<Prospect>(`${this.API_URL}/${id}`, prospect);
  }

  deleteProspect(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  convertToClient(id: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/${id}/convert`, {});
  }
}