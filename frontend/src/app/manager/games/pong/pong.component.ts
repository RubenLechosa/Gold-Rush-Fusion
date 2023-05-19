import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css']
})
export class PongComponent implements OnInit {
  dataLoaded!: Promise<boolean>;
  user_data: any = {role: "student"};

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe(
    (response: any) => {
      if(response.status == 200 && response.data) {
        this.user_data = response.data;

        this.dataLoaded = Promise.resolve(true);
      }
    },
    error => {
      this.router.navigate(['/login']);
    });
  }
}
