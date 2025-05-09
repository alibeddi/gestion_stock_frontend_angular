import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Quote } from "../../models/quote";

@Injectable({
  providedIn: "root",
})
export class QuoteService {
  private readonly BASE_URL = "/api/devis";

  constructor(private http: HttpClient) {}

  getQuotes(
    page: number = 0,
    size: number = 10,
    sort: string = "dateCreation,desc",
    search?: string,
    statut?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sort", sort);

    if (search) {
      params = params.set("search", search);
    }

    if (statut) {
      params = params.set("statut", statut);
    }

    return this.http.get<any>(this.BASE_URL, { params });
  }

  getQuoteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  getQuoteByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/code/${code}`);
  }

  getQuotesByStatus(statut: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/statut/${statut}`);
  }

  getQuotesByClient(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/client/${clientId}`);
  }

  createQuote(quote: Quote): Observable<any> {
    return this.http.post<any>(this.BASE_URL, quote);
  }

  updateQuote(id: number, quote: Quote): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${id}`, quote);
  }

  updateQuoteStatus(id: number, statut: string): Observable<any> {
    return this.http.patch<any>(`${this.BASE_URL}/${id}/statut`, { statut });
  }

  deleteQuote(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }
}
