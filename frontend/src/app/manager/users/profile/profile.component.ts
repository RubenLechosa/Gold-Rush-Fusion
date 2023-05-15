import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
//import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  dataLoaded!: Promise<boolean>;
  user_data: any;
  self_data: any;
  id_profile = "";
  selfProfile: boolean = false;
  badge_info: any = {C: 'Cooperation', R: 'Responsability', A: 'Autonomy', H: 'Habilities to thing about', G: 'Emotional Gestion'};
  badge_desc: any = {C: 'Skill that includes behaviors that facilitate group work: actions related to participation, active listening, shared decision-making, and conflict resolution.', R: 'Ability that refers to self-discipline to achieve a goal, and to maintain an attitude of work and effort towards the tasks to be performed.', A: 'Autonomy involves working independently, without the need for supervision and asking for help only when required. The Initiative indicates confidence to take things forward: propose ideas and seek solutions to problems when necessary.', H: 'Skills that allow you to capture information and process it to build and organize knowledge, so that it can be used to solve problems in a variety of situations. They involve intellectual inquiry, idea generation and metacognition skills.', G: 'Skill that involves being aware of one´s own emotions and those of others and managing them appropriately.'}; 
  
  form = new FormGroup({
    password: new FormControl(null, Validators.compose([Validators.minLength(4), Validators.required])),
    new_password: new FormControl(null, Validators.compose([Validators.minLength(4), Validators.required])),
    confirm_password: new FormControl(null, Validators.compose([Validators.minLength(4), Validators.required]))
  });

  constructor(private authService: AuthService, public userService: UserService,  private readonly route: ActivatedRoute, private readonly router: Router ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id_profile = params['id']; // (+) converts string 'id' to a number
    });

    this.selfProfile = this.id_profile == String(localStorage.getItem('id'));
    this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe((response: any) => {
      if(response.status == 200 && response.data) {
        this.self_data = response.data;
        
        this.userService.getUserDetails(String(this.id_profile)).subscribe((response: any) => {
          if(response.status == 200 && response.data) {
            this.user_data = response.data;
            this.user_data.skin = (this.user_data.skin != "{}" && this.user_data.skin != "" ? JSON.parse(this.user_data.skin) : JSON.parse('{"skin_base":"/assets/img/popers/poper1.png"}'));
            this.user_data.stats_base = (this.user_data.stats_base != "{}" && this.user_data.stats_base != "" ? JSON.parse(this.user_data.stats_base) : JSON.parse('{"health": "200", "strength": "50"}'))

            this.userService.getCourses(String(localStorage.getItem('id'))).subscribe((courses: any) => {
              if(courses.status == 200) {
                this.user_data.courses = courses.data;
        
                this.dataLoaded = Promise.resolve(true);
              } else {
                this.router.navigate(["/manager"]);
              }
            });
          }
        });
      }
    });
  }
  
  onSubmit() {
    this.userService.changePassword(Number(localStorage.getItem('id')), String(this.form.get("password")?.value), String(this.form.get("new_password")?.value), String(this.form.get("confirm_password")?.value)).subscribe((passwords: any) => {
      
      if(passwords.status == 200) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(["/profile/"+this.id_profile]);
      }
    });
  }
}
