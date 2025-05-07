import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Quote {
  id: number;
  clientName: string;
  total: number;
  date: string;
  status: string;
  // Add more fields as needed
}

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private BASE_URL = 'http://localhost:8080/api/quotes'; // Update if needed

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.BASE_URL);
  }

  getQuote(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.BASE_URL}/${id}`);
  }

  createQuote(quote: Partial<Quote>): Observable<Quote> {
    return this.http.post<Quote>(this.BASE_URL, quote);
  }

  updateQuote(id: number, quote: Partial<Quote>): Observable<Quote> {
    return this.http.put<Quote>(`${this.BASE_URL}/${id}`, quote);
  }

  deleteQuote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
}
