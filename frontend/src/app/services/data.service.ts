import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const apiUrl = 'http://localhost:8000/api';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { 
   

  }

  uploadData(data: any){
    const headers = new HttpHeaders();
    return this.http.post(apiUrl+ '/file/',data, { headers: headers});
  }
}
