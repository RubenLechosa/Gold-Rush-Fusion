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
    return this.frameworkService.login(email, password).pipe(
      tap((response: any) => {
        this._isLoggedIn.next(true);

        localStorage.setItem('id', response.id);
        localStorage.setItem('token', response.accessToken);
      })
    );
  }

  register(username: string, email: string, password: string) {
      return this.frameworkService.register(username, email, password).pipe(
        tap((response: any) => {
          this._isLoggedIn.next(true);

          localStorage.setItem('id', response.id);
          localStorage.setItem('token', response.accessToken);
        })
      );
  }

  logout() {
    localStorage.removeItem("id");
    localStorage.removeItem("auth_token");
    this.router.navigate(['/login']);
  }
}