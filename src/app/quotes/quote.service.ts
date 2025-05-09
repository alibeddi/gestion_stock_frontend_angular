import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// Updated to match the backend Devis entity
export interface Quote {
  id?: number;
  numeroDevis?: string;
  sujet: string;
  clientId?: number;
  client?: any;
  prospectId?: number;
  prospect?: any;
  echeance?: string;
  delaiLivraison?: string;
  modeLivraison?: string;
  modePaiement?: string;
  lignesDevis?: any[];
  totalTTC?: number;
  totalPoidsKg?: number;
  dateCreation?: string;
  dateModification?: string;
}

@Injectable({ providedIn: "root" })
export class QuoteService {
  // Updated to match the backend controller path
  private BASE_URL = "/api/devis";

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<any> {
    return this.http.get<any>(this.BASE_URL);
  }

  getQuote(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  createQuote(quote: Partial<Quote>): Observable<any> {
    return this.http.post<any>(this.BASE_URL, quote);
  }

  updateQuote(id: number, quote: Partial<Quote>): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${id}`, quote);
  }

  deleteQuote(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }

  getQuotesByClient(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/client/${clientId}`);
  }

  getQuotesByProspect(prospectId: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/prospect/${prospectId}`);
  }

  addQuoteLine(quoteId: number, quoteLine: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/${quoteId}/lignes`, quoteLine);
  }

  removeQuoteLine(quoteId: number, lineId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.BASE_URL}/${quoteId}/lignes/${lineId}`
    );
  }

  calculateTotals(quoteId: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/${quoteId}/calculate`, {});
  }
}
