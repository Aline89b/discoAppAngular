import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { decodedToken } from '../models/decodedToken';


@Injectable({
  providedIn: 'root'
})



export class AuthService {
userUrl = "http://localhost:3000/api/users"

  constructor(private http: HttpClient,private cookie:CookieService) { }

  addUser(email: string, password: string, role:string): Observable<any>{
    return this.http.post(this.userUrl, {email,password, role})

  }
  logIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.userUrl}/login`, { email, password });
  }
 
  resetPWrequest(email:string): Observable<any>{
    return this.http.post(`${this.userUrl}/resetPWrequest`, { email })
  }

  resetPW(id: string, password:string, verificationCode:string): Observable<any>{
    return this.http.patch(`${this.userUrl}/resetPW/${id}`, { password, verificationCode })
  }

  inviteUser(name: string, email:string, password:string, role:string): Observable<any>{
    return this.http.post(`${this.userUrl}/invite-user`, { name, email,password,role })
  }

  getUserRole(): Observable<string> {
    const token = this.cookie.get('token'); // Or any storage method you use
    if (token) {
      const decodedToken :decodedToken = jwtDecode(token)
      return of(decodedToken.role); // Adjust according to your token structure
    } else {
      return of('')
    }
  }
}


