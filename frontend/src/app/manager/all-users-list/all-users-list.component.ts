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
  @ViewChild('closeBadgesButton') closeBadgesButton!:any;
  
  id_college!: number;
  dataLoaded!: Promise<boolean>;
  user_data: any;
  user_list: any;
  all_users: any;
  editingUser!: number;
  activePoints: number = 50;

  filteredHistory: any;
  AllHistory: any;


  form = new FormGroup({ id_student: new FormControl(null, Validators.required) });

  formGems = new FormGroup({
    gems: new FormControl(null, Validators.compose([Validators.required, Validators.min(1)])),
    action: new FormControl(null, Validators.compose([Validators.required, Validators.pattern("res|sum|set")]))
  });

  formFilters = new FormGroup({
    user: new FormControl(null),
    badge: new FormControl(null),
    id_user_submited: new FormControl(null),
    created_at: new FormControl(null),
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

  submitAddGems() {
    if(this.formGems.invalid) {
      return;
    }

    this.userService.addGems(this.editingUser, Number(this.formGems.get("gems")?.value), String(this.formGems.get("action")?.value)).subscribe((result: any) => {
      if(result.status == 200) {
        Swal.fire({
          title: 'You have added the gems',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.reloadUsers();
        this.closeGemsButton.nativeElement.click();
      }
    });
  }
}
