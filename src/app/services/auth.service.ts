import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAutenticated: boolean = false;
  roles: any;
  email: any;
  accessToken!: any;

  constructor(private http: HttpClient, private router: Router) { }

  public Login(email: string, password: string) {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    }

    let params = { email: email, password: password };
    return this.http.post("http://localhost:8085/auth/login", params, options)
  }
  loadProfile(data: any) {
    this.isAutenticated = true;
    this.accessToken = data['access-token'];
    let decodedJwt: any = jwtDecode(this.accessToken);

    this.email = decodedJwt.sub;
    this.roles = decodedJwt.roles || []; // Make sure roles are set, even if empty

    window.localStorage.setItem('jwt-token', this.accessToken); // Store the token
  }

  Logout() {
    this.isAutenticated = false;
    this.accessToken = undefined;
    this.email = undefined;
    this.roles = undefined;
    window.localStorage.removeItem("jwt-token");
    this.router.navigateByUrl("/login");
  }
  loadJwtTokenFromLocalStorage() {
    let token = window.localStorage.getItem("jwt-token");
    if (token) {
      this.loadProfile({ "access-token": token });
      this.router.navigateByUrl("/admin/customers");
    }
  }
  changePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    const url = `${environment.backendHost}/auth/change-password`;
    const body = { email, oldPassword, newPassword };
    return this.http.post(url, body, { responseType: 'text' }).pipe(
      map(response => {
        try {
          return JSON.parse(response); // Essayer de parser la réponse en JSON
        } catch (e) {
          return { message: response }; // Si ce n'est pas du JSON, retourner la réponse brute
        }
      }),
      catchError(error => {
        console.error('Error changing password:', error);
        return throwError(() => new Error('Failed to change password'));
      })
    );
  }
}
