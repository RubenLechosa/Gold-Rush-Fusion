import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  user_data = this.userService.getUser(Number(localStorage.getItem('id')));
  
  constructor(private userService: UserService, private router: Router) { }
}
