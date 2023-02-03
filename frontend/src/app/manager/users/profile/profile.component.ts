import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  dataLoaded!: Promise<boolean>;
  user_data: any;
  id_profile = "";

  constructor(private authService: AuthService, public userService: UserService,  private readonly route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id_profile = params['id']; // (+) converts string 'id' to a number
    });

    this.userService.getUserDetails(String(this.id_profile)).subscribe((response: any) => {
      if(response.status == 200 && response.data) {
        this.user_data = response.data;

        this.dataLoaded = Promise.resolve(true);
      } else {
        this.authService.logout();
      }
    });
  }
}
