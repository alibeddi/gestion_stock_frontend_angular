import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Client, ClientFilter } from "../core/models/client";
import { debugApiResponse } from "../core/utils/api-utils";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  private readonly API_URL = "http://localhost:8080/api/clients";

  constructor(private http: HttpClient) {}

  getClients(
    filter?: ClientFilter,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());

    if (filter) {
      if (filter.nom) params = params.set("nom", filter.nom);
      if (filter.matriculeFiscal)
        params = params.set("matriculeFiscal", filter.matriculeFiscal);
      if (filter.email) params = params.set("email", filter.email);
      if (filter.secteurActiviteId)
        params = params.set(
          "secteurActiviteId",
          filter.secteurActiviteId.toString()
        );
      if (filter.sourceProspection)
        params = params.set("sourceProspection", filter.sourceProspection);
      if (filter.statut) params = params.set("statut", filter.statut);
    }

    return this.http.get<any>(this.API_URL, { params }).pipe(
      map((response) => {
        debugApiResponse(response, "Client List Response");
        return response;
      })
    );
  }

  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map((response) => {
        debugApiResponse(response, `Client ${id} Response`);
        return response;
      })
    );
  }

  createClient(client: Client): Observable<any> {
    return this.http.post<any>(this.API_URL, client).pipe(
      map((response) => {
        debugApiResponse(response, "Create Client Response");
        return response;
      })
    );
  }

  updateClient(id: number, client: Client): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, client).pipe(
      map((response) => {
        debugApiResponse(response, `Update Client ${id} Response`);
        return response;
      })
    );
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`).pipe(
      map((response) => {
        debugApiResponse(response, `Delete Client ${id} Response`);
        return response;
      })
    );
  }
}
