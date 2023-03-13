import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  alreadySubmit: boolean = false;
  dataLoaded!: Promise<boolean>;
  user_data: any;
  id_course?: number;
  course_data: any;
  tasks_list: any;


  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute,  private router: Router, private courseService: CourseService, private tasksService: TaskService) { }



ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.id_course = params['id']; // (+) converts string 'id' to a number
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
          
          this.reloadTasks();
          this.dataLoaded = Promise.resolve(true);
        }
      });

    } else {
      this.authService.logout();
    }
  });
}

reloadTasks() {
  this.tasksService.getTasksList(Number(this.id_course)).subscribe((tasks: any) => {
    if(tasks.status == 200) {
      this.tasks_list = tasks.data;

      if(this.tasks_list.tasks) {
        this.tasks_list.tasks = JSON.parse(this.tasks_list.tasks);
      }
    }
  });
  this.alreadySubmit = false;
}

deleteTask(id_task: number) {
  this.alreadySubmit = true;
  this.tasksService.removeTask(id_task).subscribe((tasks: any) => {
    if(tasks.status == 200) {
      this.reloadTasks();
    }
  });
}

}