import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-submits-list',
  templateUrl: './user-submits-list.component.html',
  styleUrls: ['./user-submits-list.component.css']
})
export class UserSubmitsListComponent {
  dataLoaded!: Promise<boolean>;
  user_data: any;
  id_course?: number;
  id_task?: number;
  course_data: any;
  task_data: any;

constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute,  private router: Router, private courseService: CourseService, private tasksService: TaskService) { }

ngOnInit(): void {

  this.route.params.subscribe(params => {
    this.id_course = params['id']; // (+) converts string 'id' to a number
    this.id_task = params['id_task']; // (+) converts string 'id' to a number
  });


  this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe((response: any) => {
    if(response.status == 200 && response.data) {
      this.user_data = response.data;
      
      this.authService.checkPermissions(this.user_data.role, ["student", "college_manager", "teacher"]);

      this.courseService.getDetails(String(this.id_course)).subscribe((courses: any) => {
        if(courses.status == 200) {
          this.course_data = courses.data;

          var cursos = JSON.parse(this.user_data.courses);
          if(cursos.indexOf(this.id_course)) {
            this.router.navigate(["/manager"]);
          }

          this.tasksService.getTaskDetails(Number(this.id_task)).subscribe((tasks: any) => {
            if(tasks.status == 200) {
              this.task_data = tasks.data;

              this.dataLoaded = Promise.resolve(true);
            }
          });
        }
      });

    } else {
      this.router.navigate(['/login']);
    }
  });
}

}