import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  error = '';
  form = new FormGroup({
    username: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    cpassword: new FormControl(null, Validators.required),
  });

  constructor(private authService: AuthService, private router: Router) { }

  submitForm() {
    if (this.form.invalid) {
      return;
    }

    /*if(this.validatePasswords(this.form)) {
      this.authService
        .register(String(this.form.get('username')?.value),String(this.form.get('email')?.value), String(this.form.get('password')?.value))
        .subscribe(
          result => {
            this.router.navigate(['/manager']);
          },
          error => {
            console.log(error.error.message);
            this.error = error.error.message;
          }
        );
    } else {
      this.error = 'passwords';
    }*/
  }

  validatePasswords(control: AbstractControl) {
    if (control && control.get("password") && control.get("cpassword")) {
      const password = control.get("password")?.value;
      const cpassword = control.get("cpassword")?.value;
      
      return (password == cpassword);
    }
  
    return 0;
  }
}