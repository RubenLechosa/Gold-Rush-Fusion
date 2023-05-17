import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const baseUrl = 'http://localhost:8000/api';
var header = new HttpHeaders({
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

  get(url: string, body: any) {
    return this.http.get(`${baseUrl}/${url}`, body);
  }

  post(url: string, body: any, auth: boolean = true) {
    if(auth) {
      header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      });
    }

    return this.http.post(`${baseUrl}/${url}`, body, {headers: header});
  }

  upload_file(data: any){
    header = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.post(`${baseUrl}/file/`, data , { headers: header});
  }
}
