import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  noAuthHeader = {headers: new HttpHeaders({ 'NoAuth': 'True' })}

  constructor(
    private http: HttpClient
  ) { }

  login(authCredential) {
    return this.http.post<any>(environment.apiBaseUrl + 'authenticate', authCredential, this.noAuthHeader)
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + 'userProfile');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  
  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = this.getToken();
    if(token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else {
      return null;
    }
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if(userPayload) {
      return userPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  validatePassword(authCredential) {
    return this.http.post<any>(environment.apiBaseUrl + 'validatePassword', authCredential);
  }

  getToken() {
    return localStorage.getItem('token');
  }

}
