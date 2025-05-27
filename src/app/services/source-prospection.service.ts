import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SourceProspectionService {
  private apiUrl = `${environment.apiUrl}/sources-prospection`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(source: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, source);
  }

  update(source: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${source.id}`, source);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}