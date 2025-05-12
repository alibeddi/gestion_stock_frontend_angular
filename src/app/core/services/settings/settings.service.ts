import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../api.service";

export interface UserSettings {
  id?: number;
  userId: number;
  language: string;
  notificationEmail: boolean;
  notificationSms: boolean;
  dateCreation?: Date;
  dateModification?: Date;
}

export interface CompanySettings {
  id?: number;
  companyName: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  postalCode?: string;
  city: string;
  country: string;
  website?: string;
  logoUrl?: string;
  currency: string;
  dateCreation?: Date;
  dateModification?: Date;
}

export interface AllSettings {
  userSettings: UserSettings | null;
  companySettings: CompanySettings | null;
}

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private apiService: ApiService) {}

  // Get all settings (user + company)
  getAllSettings(): Observable<any> {
    return this.apiService.get<any>(`${this.baseUrl}/settings`);
  }

  // User Settings
  getCurrentUserSettings(): Observable<any> {
    return this.apiService.get<any>(`${this.baseUrl}/settings/user/current`);
  }

  getUserSettings(userId: number): Observable<any> {
    return this.apiService.get<any>(`${this.baseUrl}/settings/user/${userId}`);
  }

  createUserSettings(settings: UserSettings): Observable<any> {
    return this.apiService.post<any>(`${this.baseUrl}/settings/user`, settings);
  }

  updateUserSettings(userId: number, settings: UserSettings): Observable<any> {
    return this.apiService.put<any>(
      `${this.baseUrl}/settings/user/${userId}`,
      settings
    );
  }

  // Company Settings
  getCompanySettings(): Observable<any> {
    return this.apiService.get<any>(`${this.baseUrl}/settings/company`);
  }

  createCompanySettings(settings: CompanySettings): Observable<any> {
    return this.apiService.post<any>(
      `${this.baseUrl}/settings/company`,
      settings
    );
  }

  updateCompanySettings(
    id: number,
    settings: CompanySettings
  ): Observable<any> {
    return this.apiService.put<any>(
      `${this.baseUrl}/settings/company/${id}`,
      settings
    );
  }
}
