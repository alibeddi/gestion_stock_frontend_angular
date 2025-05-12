import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../api.service";

export interface Emballage {
  id?: number;
  code: string;
  libelle: string;
  poids?: number;
  typeEmballage?: string;
  dateCreation?: Date;
  dateModification?: Date;
}

@Injectable({
  providedIn: "root",
})
export class EmballageService {
  private baseUrl = `${environment.apiUrl}/emballages`;

  constructor(private apiService: ApiService) {}

  getAllEmballages(): Observable<any> {
    return this.apiService.get<any>(this.baseUrl);
  }

  getEmballageById(id: number): Observable<any> {
    return this.apiService.get<any>(`${this.baseUrl}/${id}`);
  }

  getEmballageByCode(code: string): Observable<any> {
    return this.apiService.get<any>(`${this.baseUrl}/code/${code}`);
  }

  getEmballagesByLibelle(libelle: string): Observable<any> {
    return this.apiService.get<any>(`${this.baseUrl}/libelle/${libelle}`);
  }

  getEmballagesByType(typeEmballage: string): Observable<any> {
    return this.apiService.get<any>(`${this.baseUrl}/type/${typeEmballage}`);
  }

  createEmballage(emballage: Emballage): Observable<any> {
    return this.apiService.post<any>(this.baseUrl, emballage);
  }

  updateEmballage(id: number, emballage: Emballage): Observable<any> {
    return this.apiService.put<any>(`${this.baseUrl}/${id}`, emballage);
  }

  deleteEmballage(id: number): Observable<any> {
    return this.apiService.delete<any>(`${this.baseUrl}/${id}`);
  }
}
