import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error: boolean = false;
  form = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  onSubmit() {
    var login = false;
    if (this.form.invalid) {
      this.error = true;
      return;
    }

    this.userService.login(String(this.form.get('email')?.value), String(this.form.get('password')?.value)).subscribe((response: any) => {
      if(response.success) {
          localStorage.setItem('id', response.id_user);
          localStorage.setItem('token', response.access_token);
          this.authService._isLoggedIn.next(true);
          this.router.navigate(['/manager']);
          login = true;
      }
    },
    error => {
      this.error = true;
    });
  }
}
