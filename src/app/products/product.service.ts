import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiService } from "../core/services/api.service";
import { Emballage } from "../core/services/emballage/emballage.service";

export interface Product {
  id?: number;
  code: string;
  libelle: string;
  emballage?: Emballage;
  categorie?: string;
  poidsKg?: number;
  typeProduit?: string;
  actif: boolean;
  isPackage: boolean;
  ecozit: boolean;
  prixGros: number;
  prixDetail: number;
  prixGerant: number;
  dateCreation?: Date;
  dateModification?: Date;
  // Additional fields not in ProduitDto but used in frontend
  description?: string;
  quantity?: number;
}

@Injectable({ providedIn: "root" })
export class ProductService {
  private baseUrl = `${environment.apiUrl}/produits`;

  constructor(private apiService: ApiService) {}

  getProducts(): Observable<any> {
    return this.apiService.get<any>(this.baseUrl);
  }

  getProduct(id: number): Observable<any> {
    return this.apiService.get<any>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: Product): Observable<any> {
    return this.apiService.post<any>(this.baseUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<any> {
    return this.apiService.put<any>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.apiService.delete<any>(`${this.baseUrl}/${id}`);
  }
}
