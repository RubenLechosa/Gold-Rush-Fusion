import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8000/api';
const header = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
});

@Injectable({
  providedIn: 'root'
})
export class FrameworkService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post(`${baseUrl}/user/login`, { email, password }, {headers: header});
  }

  register(username: string, email: string, password: string) {
    return this.http.post(`${baseUrl}/user/register`, { username, email, password }, {headers: header});
  }
}
