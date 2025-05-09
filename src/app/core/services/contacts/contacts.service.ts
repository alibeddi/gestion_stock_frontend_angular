import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Contact } from "../../models/contact.model";

@Injectable({
  providedIn: "root",
})
export class ContactsService {
  private readonly BASE_URL = "/api/contacts";

  constructor(private http: HttpClient) {}

  getContacts(
    page: number = 0,
    size: number = 10,
    sort: string = "dateCreation,desc",
    search?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sort", sort);

    if (search) {
      params = params.set("search", search);
    }

    return this.http
      .get<any>(this.BASE_URL, { params })
      .pipe(tap((response) => console.log("Get contacts response:", response)));
  }

  getContactById(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.BASE_URL}/${id}`)
      .pipe(
        tap((response) =>
          console.log(`Get contact with id ${id} response:`, response)
        )
      );
  }

  getContactsByClient(clientId: number): Observable<any> {
    return this.http
      .get<any>(`${this.BASE_URL}/client/${clientId}`)
      .pipe(
        tap((response) =>
          console.log(`Get contacts by client ${clientId} response:`, response)
        )
      );
  }

  getContactsByProspect(prospectId: number): Observable<any> {
    return this.http
      .get<any>(`${this.BASE_URL}/prospect/${prospectId}`)
      .pipe(
        tap((response) =>
          console.log(
            `Get contacts by prospect ${prospectId} response:`,
            response
          )
        )
      );
  }

  createContact(contact: Contact): Observable<any> {
    console.log("Creating contact with data:", contact);
    return this.http.post<any>(this.BASE_URL, contact).pipe(
      tap((response) => console.log("Create contact response:", response)),
      catchError((error) => {
        console.error("Error creating contact:", error);
        console.error("Request payload was:", contact);
        throw error;
      })
    );
  }

  updateContact(id: number, contact: Contact): Observable<any> {
    console.log(`Updating contact ${id} with data:`, contact);
    return this.http.put<any>(`${this.BASE_URL}/${id}`, contact).pipe(
      tap((response) =>
        console.log(`Update contact ${id} response:`, response)
      ),
      catchError((error) => {
        console.error(`Error updating contact ${id}:`, error);
        console.error("Request payload was:", contact);
        throw error;
      })
    );
  }

  deleteContact(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.BASE_URL}/${id}`)
      .pipe(
        tap((response) =>
          console.log(`Delete contact ${id} response:`, response)
        )
      );
  }
}
