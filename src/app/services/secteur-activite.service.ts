import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface SecteurActivite {
    id: number;
    code: string;
    libelle: string;
  }
  
  export interface SecteurActiviteResponse {
    data: SecteurActivite[];
  }
@Injectable({
  providedIn: 'root'
})

export class SecteurActiviteService {
  private apiUrl = `${environment.apiUrl}/secteurs-activite`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SecteurActiviteResponse> {
    return this.http.get<SecteurActiviteResponse>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(secteurActivite: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, secteurActivite);
  }

  update(secteurActivite: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${secteurActivite.id}`, secteurActivite);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}