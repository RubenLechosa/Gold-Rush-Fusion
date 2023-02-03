import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FrameworkService } from './framework.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private frameworkService: FrameworkService, private router : Router) { }

  login(email: string, password: string) {
    return this.frameworkService.post('login', { email, password });
  }

  register(nick: string, name: string, last_name: string, email: string, college: string, password: string, password_confirmation: string) {
    return this.frameworkService.post('register', { nick, name, last_name, email, college, password, password_confirmation });
  }

  getUserDetails(id_user: string) {
    return this.frameworkService.post('users/get-user', { id_user });
  }
}
