import { formatDate } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BadgeService } from 'src/app/services/badge.service';
import { CollegeService } from 'src/app/services/college.service';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-users-list',
  templateUrl: './all-users-list.component.html',
  styleUrls: ['./all-users-list.component.css']
})
export class AllUsersListComponent {
  @ViewChild('closebutton') closebutton!:any;
  @ViewChild('closeGemsButton') closeGemsButton!:any;
  
  id_college!: number;
  dataLoaded!: Promise<boolean>;
  user_data: any;
  user_list: any;
  all_users: any;
  editingUser!: number;
  activePoints: number = 50;

  filteredHistory: any;
  AllHistory: any;


  form = new FormGroup({ 
    name: new FormControl(null, Validators.required),
    last_name: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    role: new FormControl(null, Validators.required),
  });

  
  formBadge = new FormGroup({C: new FormControl(null), R: new FormControl(null), H: new FormControl(null), G: new FormControl(null), A: new FormControl(null)});
  restPoints: number = 0;
  disabledSubmit: boolean = true;
  
  badges: any = [
    {name: 'C', title: 'Cooperation', value: 0},
    {name: 'R', title: 'Responsibility', value: 0},
    {name: 'H', title: 'Thinking Skills', value: 0},
    {name: 'G', title: 'Emotions Management', value: 0},
    {name: 'A', title: 'Autonomy and Initiative', value: 0}
  ]
  
  
  constructor(private router: Router, private userService: UserService, private badgeService: BadgeService, private collegeService: CollegeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe((response: any) => {
      if(response.status == 200 && response.data) {
        this.user_data = response.data;
        this.restPoints = this.user_data.skills_points;
        this.id_college = this.user_data.id_college;

        this.reloadUsers();
      } else {
        this.router.navigate(['/login']);
      }
    },
    error => {
      this.router.navigate(['/login']);
    });

  }

  reloadUsers() {
    this.userService.getUsersByCollege(String(this.id_college)).subscribe((users: any) => {
      if(users.status == 200) {
        this.user_list = users.data;
        this.dataLoaded = Promise.resolve(true);
      }
    });
  }

  addUser() {
    if(this.form.invalid) {
      console.log("mec");
      return;
    }

    this.userService.createUser(String(this.form.get("name")?.value), String(this.form.get("last_name")?.value), String(this.form.get("email")?.value), this.id_college, String(this.form.get("role")?.value),).subscribe((result: any) => {
      if(result.success) {
        Swal.fire({
          title: 'You have added the user',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.reloadUsers();

        this.form.reset();
        this.closeGemsButton.nativeElement.click();
      }
    },
    error => {
      Swal.fire({
        title: 'Error on adding user',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }


}
