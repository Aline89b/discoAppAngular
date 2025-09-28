import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { decodedToken } from '../models/decodedToken';
import { baseUrl } from '../url';


@Injectable({
  providedIn: 'root'
})



export class AuthService {
userUrl = `${baseUrl}/api/users`

  constructor(private http: HttpClient,private cookie:CookieService) { }

  addUser(email: string, password: string, role:string): Observable<any>{
    return this.http.post(this.userUrl, {email,password, role}, { withCredentials: true })

  }
  logIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.userUrl}/login`, { email, password }, { withCredentials: true });
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


