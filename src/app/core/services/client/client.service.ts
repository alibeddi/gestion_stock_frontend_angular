import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly BASE_URL = 'http://localhost:8080/api/api/clients';

  constructor(private http: HttpClient) { }

  getClients(
    page: number = 0, 
    size: number = 10, 
    sort: string = 'dateCreation,desc',
    search?: string,
    type?: string,
    actif?: boolean
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    
    if (search) {
      params = params.set('search', search);
    }
    
    if (type) {
      params = params.set('type', type);
    }
    
    if (actif !== undefined) {
      params = params.set('actif', actif.toString());
    }
    
    return this.http.get<any>(this.BASE_URL, { params });
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.BASE_URL}/${id}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.BASE_URL, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.BASE_URL}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
}
