import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModePaiementService {
  private apiUrl = `${environment.apiUrl}/payment-modes`;

  constructor(private http: HttpClient) {}

  getModePaiements(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getModePaiementById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createModePaiement(modePaiement: any): Observable<any> {
    return this.http.post(this.apiUrl, modePaiement);
  }

  updateModePaiement(id: number, modePaiement: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, modePaiement);
  }

  deleteModePaiement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}