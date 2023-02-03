import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  dataLoaded!: Promise<boolean>;
  user_data: any;
  college_data: any;
  // this.userService.getUser(Number(localStorage.getItem('id')));
  
  constructor(private authService: AuthService, private userService: UserService, private collegeService: CollegeService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe((response: any) => {
      if(response.status == 200 && response.data) {
        this.user_data = response.data;

        this.collegeService.getCollegeDetails(String(response.data.id_college)).subscribe((response: any) => {
          if(response.status == 200) {
            this.college_data = response.data;
            this.dataLoaded = Promise.resolve(true);
          } else {
            this.authService.logout();
          }
        });
      } else {
        this.authService.logout();
      }
    });
  }
}
