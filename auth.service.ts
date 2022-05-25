import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated = localStorage.getItem('AUTH_TOKEN') ? true : false;
  constructor(private http: HttpClient) {}

  login(body: any): Observable<any> {
    let apiUrl = 'login';
    return this.http.post(environment.apiBaseUrl + apiUrl, body);
  }
}

