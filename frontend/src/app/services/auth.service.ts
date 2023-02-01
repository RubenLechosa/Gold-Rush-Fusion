import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FrameworkService } from './framework.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this._isLoggedIn.asObservable();

  constructor(private frameworkService: FrameworkService, private router : Router) {
    const token = localStorage.getItem('token');
    this._isLoggedIn.next(!!token);
  }

  login(email: string, password: string) {
    return this.frameworkService.login(email, password).subscribe((response: any) => {
        this._isLoggedIn.next(true);

        localStorage.setItem('id', response.id_user);
        localStorage.setItem('token', response.access_token);
      });
  }

  register(nick: string, name: string, last_name: string, email: string, password: string, password_confirmation: string) {
      return this.frameworkService.register(nick, name, last_name, email, password, password_confirmation).subscribe((response: any) => {
          console.log(response);
          if(response.status == 200 && this.login(email, password)) {
            this._isLoggedIn.next(true);
          }
        });
  }

  logout() {
    localStorage.removeItem("id");
    localStorage.removeItem("auth_token");
    this.router.navigate(['/login']);
  }
}