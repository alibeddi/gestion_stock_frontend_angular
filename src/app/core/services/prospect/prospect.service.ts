import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prospect } from '../../models/prospect';

@Injectable({
  providedIn: 'root'
})
export class ProspectService {
  private readonly BASE_URL = 'http://localhost:8080/api/api/prospects';

  constructor(private http: HttpClient) { }

  getProspects(
    page: number = 0, 
    size: number = 10, 
    sort: string = 'dateCreation,desc',
    search?: string,
    statut?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    
    if (search) {
      params = params.set('search', search);
    }
    
    if (statut) {
      params = params.set('statut', statut);
    }
    
    return this.http.get<any>(this.BASE_URL, { params });
  }

  getProspectById(id: number): Observable<Prospect> {
    return this.http.get<Prospect>(`${this.BASE_URL}/${id}`);
  }

  createProspect(prospect: Prospect): Observable<Prospect> {
    return this.http.post<Prospect>(this.BASE_URL, prospect);
  }

  updateProspect(id: number, prospect: Prospect): Observable<Prospect> {
    return this.http.put<Prospect>(`${this.BASE_URL}/${id}`, prospect);
  }

  deleteProspect(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  convertToClient(id: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/${id}/convert`, {});
  }
}