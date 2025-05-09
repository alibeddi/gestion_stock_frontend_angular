import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Product {
  id: number;
  code: string;
  libelle: string;
  description: string;
  prixDetail: number;
  prixGerant: number;
  prixGros: number;
  quantity: number;
}

@Injectable({ providedIn: "root" })
export class ProductService {
  private readonly BASE_URL = "http://localhost:8080/api/api/produits"; // Adjust if your backend URL differs

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(this.BASE_URL);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.BASE_URL}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.BASE_URL, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.BASE_URL}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
}
