import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent {
  id_course!: number;
  dataLoaded!: Promise<boolean>;
  user_data: any;
  course_data: any;
  courses: any;

  form = new FormGroup({
    course_name: new FormControl(null, Validators.compose([Validators.min(6), Validators.required])),
    id_teacher: new FormControl(null, Validators.compose([Validators.min(4), Validators.required])),
    img: new FormControl(null, Validators.required)
  });

  constructor(private authService: AuthService, private router: Router, private courseService: CourseService, private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id_course = params['id']; // (+) converts string 'id' to a number
    });

    this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe((response: any) => {
      if(response.status == 200 && response.data) {
        this.user_data = response.data;
      } else {
        this.authService.logout();
      }
    });

    if(this.id_course != 0) {
      this.courseService.getDetails(String(this.id_course)).subscribe((courses: any) => {
        if(courses.status == 200) {
          this.course_data = courses.data;

          this.dataLoaded = Promise.resolve(true);
        }
      });
    } else {
      this.dataLoaded = Promise.resolve(true);
    }

  }

  onSubmit() {

  }
}
