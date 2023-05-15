import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this._isLoggedIn.asObservable();

  constructor(private userService: UserService, private router : Router) {
    const token = localStorage.getItem('token');
    this._isLoggedIn.next(!!token);
  }

  register(nick: string, name: string, last_name: string, email: string, college: string, password: string, password_confirmation: string) {
      return this.userService.register(nick, name, last_name, email, college, password, password_confirmation).subscribe((response: any) => {

          if(response.status == 200) {
            this.router.navigate(['/login']);
          }
        });
  }

  checkPermissions(role: string, permited_roles: string[] = ["teacher", "college_manager"], route: string = "/manager", checkId: number | boolean = false, idtoCheck: number | boolean = false) {
    if (permited_roles.indexOf(role) < 0 && role != "admin") {
      this.router.navigate([route]);
    }

    if(checkId && idtoCheck && role == "student") {
      if(checkId != idtoCheck) {
        this.router.navigate([route]);
      }
    }
  }

  logout() {
    this._isLoggedIn.next(false);
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }
}