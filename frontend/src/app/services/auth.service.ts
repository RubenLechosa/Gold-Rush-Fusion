import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this._isLoggedIn.asObservable();

  constructor(private userService: UserService, private router : Router) {
    const token = localStorage.getItem('token');
    this._isLoggedIn.next(!!token);
  }

  login(email: string, password: string) {
    return this.userService.login(email, password).subscribe((response: any) => {
        this._isLoggedIn.next(true);

        localStorage.setItem('id', response.id_user);
        localStorage.setItem('token', response.access_token);

        this.router.navigate(['/manager']);
      });
  }

  register(nick: string, name: string, last_name: string, email: string, college: string, password: string, password_confirmation: string) {
      return this.userService.register(nick, name, last_name, email, college, password, password_confirmation).subscribe((response: any) => {

          if(response.status == 200 && this.login(email, password)) {
            this._isLoggedIn.next(true);

            this.router.navigate(['/manager']);
          }
        });
  }

  logout() {
    this._isLoggedIn.next(false);
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }
}