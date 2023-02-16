import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CollegeService } from 'src/app/services/college.service';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-college.component.html',
  styleUrls: ['./edit-college.component.css']
})
export class EditCollegeComponent {
  alreadySubmit: boolean = false;
  id_college!: number;
  dataLoaded!: Promise<boolean>;
  user_data: any;
  college_data: any;

  form = new FormGroup({
    college_name: new FormControl(null, Validators.compose([Validators.min(4), Validators.required])),
    logo: new FormControl(null)
  });

  constructor(private authService: AuthService, private router: Router, private collegeService: CollegeService, private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id_college = params['id']; // (+) converts string 'id' to a number
    });

    this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe((response: any) => {
      if(response.status == 200 && response.data) {
        this.user_data = response.data;

        this.collegeService.getCollegeDetails(String(this.id_college)).subscribe((college: any) => {
          if(college.status == 200) {
            this.college_data = college.data;

            this.dataLoaded = Promise.resolve(true);
          }
        });
      } else {
        this.authService.logout();
      }
    });

  }

  onSubmit() {
    if(this.form.invalid) {
      this.alreadySubmit = true;
      return;
    }

    this.alreadySubmit = true;
    if(this.id_college != 0) {
      this.collegeService.saveCollege(String(this.id_college), String(this.form.get('college_name')?.value), String(this.form.get('logo')?.value)).subscribe((result: any) => {
        if(result.status == 200) {
          this.router.navigate(["/manager"]);
        }
        this.alreadySubmit = false;
      });
    }
  }
}
