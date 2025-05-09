import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  // Add more fields as needed
}

@Injectable({ providedIn: "root" })
export class UserService {
  private BASE_URL = "http://localhost:8080/api/users"; // Update if needed

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.BASE_URL);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.BASE_URL}/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.BASE_URL, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.BASE_URL}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
}
