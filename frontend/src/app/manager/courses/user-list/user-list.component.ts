import { formatDate } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BadgeService } from 'src/app/services/badge.service';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  @ViewChild('closebutton') closebutton!:any;
  @ViewChild('closeGemsButton') closeGemsButton!:any;
  @ViewChild('closeBadgesButton') closeBadgesButton!:any;
  
  id_course!: number;
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
    {name: 'C', title: 'Coperación', value: 0},
    {name: 'R', title: 'Responsabilidad', value: 0},
    {name: 'H', title: 'Habilidades De Pensar', value: 0},
    {name: 'G', title: 'Gestion Emociones', value: 0},
    {name: 'A', title: 'Autonomia y Iniciativa', value: 0}
  ]
  
  
  constructor(private authService: AuthService, private userService: UserService, private badgeService: BadgeService, private courseService: CourseService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id_course = params['id'];
    });

    this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe((response: any) => {
      if(response.status == 200 && response.data) {
        this.user_data = response.data;
        this.restPoints = this.user_data.skills_points;

        this.reloadUsers();
        this.reloadHistory();
      } else {
        this.authService.logout();
      }
    });

  }

  reloadUsers() {
    this.courseService.getAllUsersByCourse(String(this.id_course), String(localStorage.getItem('id'))).subscribe((users: any) => {
      if(users.status == 200) {
        this.user_list = users.data;
        
        this.userService.getUsersByCollege(String(this.user_data.id_college)).subscribe((all_user: any) => {
          if(all_user.status == 200) {
            this.all_users = all_user.data;
            
            this.dataLoaded = Promise.resolve(true);
          }
        });
      }
    });
  }

  reloadHistory() {

    this.badgeService.giveHistory(Number(this.id_course), {"id_user": this.formFilters.get("user")?.value, "badge": this.formFilters.get("badge")?.value, "id_user_submited": this.formFilters.get("id_user_submited")?.value, "created_at": this.formFilters.get("created_at")?.value}).subscribe((history: any) => {
      if(history.status == 200) {
        this.AllHistory = history.data;
        
        this.AllHistory.forEach((_history: any, idx: any) => {
          this.AllHistory[idx].created_at = formatDate(_history.created_at, 'yyyy-MM-dd', 'en');
        });
      }
    }); 
  }
  
  submitFilters() {
    this.reloadHistory();
  }

  submitAddStudent() {
    if(this.form.invalid) {
      return;
    }

    this.userService.addCourse(String(this.id_course), String(this.form.get("id_student")?.value)).subscribe((result: any) => {
      if(result.status == 200) {
        this.reloadUsers();
        this.form.reset();
        this.closebutton.nativeElement.click();
      }
    });
  }

  submitRemoveStudent(id_user: string) {
    if(confirm("Are you sure duki gay?")) {
      this.userService.removeCourse(String(this.id_course), String(id_user)).subscribe((result: any) => {
        if(result.status == 200) {
          this.reloadUsers();
        }
      });
    }
  }

  submitAddGems() {
    if(this.formGems.invalid) {
      return;
    }

    this.userService.addGems(this.editingUser, Number(this.formGems.get("gems")?.value), String(this.formGems.get("action")?.value)).subscribe((result: any) => {
      if(result.status == 200) {
        this.reloadUsers();
        this.closeGemsButton.nativeElement.click();
      }
    });
  }

  openBadgesModal(id_user: number) {
    this.activePoints = 50;
    this.editingUser = id_user;
    this.restPoints = this.user_data.skills_points;

    this.badges.forEach((badge:any, idx: any) => {
      this.badges[idx].value = 0;
    });
  }

  setActivePoints(val: number) {
    this.activePoints = val;
  }

  sumPoints(index: any) {
    if(this.restPoints >= this.activePoints) {
      this.badges[index].value += this.activePoints;
      this.restPoints -= this.activePoints;
    }

    this.disabledSubmit = true;
    this.badges.forEach((badge: any) => {
      if(badge.value > 0) {
        this.disabledSubmit = false;
      }
    });
  }

  resPoints(index: any) {
    if(this.badges[index].value >= this.activePoints) {
      this.badges[index].value -= this.activePoints;
      this.restPoints += this.activePoints;
    }

    this.disabledSubmit = true;
    this.badges.forEach((badge: any) => {
      if(badge.value > 0) {
        this.disabledSubmit = false;
      }
    });
  }

  submitPoints() {
    this.badgeService.givePoints(this.editingUser, this.id_course, Number(localStorage.getItem('id')), String(JSON.stringify(this.badges))).subscribe((result: any) => {
      if(result.status == 200) {
        this.reloadUsers();

        this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe((response: any) => {
          if(response.status == 200 && response.data) {
            this.user_data = response.data;
            this.restPoints = this.user_data.skills_points;
            this.reloadHistory();
          }
        });

        this.closeBadgesButton.nativeElement.click();
      }
    });
  }
  
  removeHistory(id_history: number) {
    this.badgeService.removeHistory(id_history).subscribe((result: any) => {
      if(result.status == 200) {
        this.reloadHistory();
      }
    });
  }
}