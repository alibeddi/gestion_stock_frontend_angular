import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Client } from "../../models/client";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  private readonly BASE_URL = "/api/clients";

  constructor(private http: HttpClient) {}

  getClients(
    page: number = 0,
    size: number = 10,
    sort: string = "dateCreation,desc",
    search?: string,
    type?: string,
    actif?: boolean
  ): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sort", sort);

    if (search) {
      params = params.set("search", search);
    }

    if (type) {
      params = params.set("type", type);
    }

    if (actif !== undefined) {
      params = params.set("actif", actif.toString());
    }

    return this.http.get<any>(this.BASE_URL, { params });
  }

  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  getClientByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/code/${code}`);
  }

  getClientsByType(type: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/type/${type}`);
  }

  getClientsByStatus(actif: boolean): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/actif/${actif}`);
  }

  createClient(client: Client): Observable<any> {
    return this.http.post<any>(this.BASE_URL, client);
  }

  updateClient(id: number, client: Client): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${id}`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }
}
