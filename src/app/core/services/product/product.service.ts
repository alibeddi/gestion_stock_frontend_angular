import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../../models/product";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private readonly BASE_URL = "/api/produits";

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}`);
  }

  getActiveProducts(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/active`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`);
  }

  getProductByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/code/${code}`);
  }

  getProductsByLibelle(libelle: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/libelle/${libelle}`);
  }

  getProductsByEmballage(emballageId: number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/emballage/${emballageId}`);
  }

  getProductsByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/categorie/${category}`);
  }

  getProductsByType(type: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/type/${type}`);
  }

  getProductsByActiveStatus(active: boolean): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/actif/${active}`);
  }

  getProductsByPackageStatus(isPackage: boolean): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/package/${isPackage}`);
  }

  getProductsByEcozitStatus(ecozit: boolean): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/ecozit/${ecozit}`);
  }

  createProduct(product: Product): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}`, product);
  }

  updateProduct(id: number, product: Product): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`);
  }
}
