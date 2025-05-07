import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientFilter } from '../core/models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = 'http://localhost:8080/api/api/clients';

  constructor(private http: HttpClient) { }

  getClients(filter?: ClientFilter, page: number = 0, size: number = 10): Observable<any> {
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
    }

    return this.http.get<any>(this.API_URL, { params });
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/${id}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.API_URL, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.API_URL}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
