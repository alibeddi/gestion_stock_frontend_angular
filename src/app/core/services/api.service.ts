import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { TokenService } from "./token/token.service";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  /**
   * Create headers with authorization token
   */
  private createHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
    }

    // Log the headers for debugging
    console.log(
      "API Headers:",
      headers.keys().map((key) => `${key}: ${headers.get(key)}`)
    );

    return headers;
  }

  /**
   * Perform a GET request
   */
  get<T>(url: string, options: any = {}): Observable<T> {
    console.log(`ApiService GET: ${url}`);

    const headers = this.createHeaders();
    const mergedOptions = {
      headers,
      ...options,
    };

    return this.http.get(url, mergedOptions).pipe(
      map((response) => response as T),
      tap((response) => console.log(`Response from GET ${url}:`, response)),
      catchError((error) => this.handleError(error, url))
    );
  }

  /**
   * Perform a POST request
   */
  post<T>(url: string, body: any, options: any = {}): Observable<T> {
    console.log(`ApiService POST: ${url}`, body);

    const headers = this.createHeaders();
    const mergedOptions = {
      headers,
      ...options,
    };

    return this.http.post(url, body, mergedOptions).pipe(
      map((response) => response as T),
      tap((response) => console.log(`Response from POST ${url}:`, response)),
      catchError((error) => this.handleError(error, url))
    );
  }

  /**
   * Perform a PUT request
   */
  put<T>(url: string, body: any, options: any = {}): Observable<T> {
    console.log(`ApiService PUT: ${url}`, body);

    const headers = this.createHeaders();
    const mergedOptions = {
      headers,
      ...options,
    };

    return this.http.put(url, body, mergedOptions).pipe(
      map((response) => response as T),
      tap((response) => console.log(`Response from PUT ${url}:`, response)),
      catchError((error) => this.handleError(error, url))
    );
  }

  /**
   * Perform a DELETE request
   */
  delete<T>(url: string, options: any = {}): Observable<T> {
    console.log(`ApiService DELETE: ${url}`);

    const headers = this.createHeaders();
    const mergedOptions = {
      headers,
      ...options,
    };

    return this.http.delete(url, mergedOptions).pipe(
      map((response) => response as T),
      tap((response) => console.log(`Response from DELETE ${url}:`, response)),
      catchError((error) => this.handleError(error, url))
    );
  }

  /**
   * Common error handler
   */
  private handleError(error: any, url: string) {
    console.error(`Error from ${url}:`, error);

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error(`Client-side error: ${error.error.message}`);
    } else {
      // Server-side error
      console.error(`Server returned code ${error.status}, body:`, error.error);

      // Check for specific HTTP error codes
      if (error.status === 401) {
        console.error("Authentication error - token may be expired or invalid");
      } else if (error.status === 403) {
        console.error("Authorization error - user doesn't have permission");
      } else if (error.status === 404) {
        console.error("Resource not found");
      }
    }

    return throwError(() => error);
  }
}
