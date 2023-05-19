import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { FrameworkService } from 'src/app/services/framework.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent {
  dataLoaded!: Promise<boolean>;
  user_data: any;
  id_course?: number;
  id_task?: number;
  course_data: any;
  task_data: any;
  files: any;
  view_submit: boolean = false;
  alreadySubmit: boolean = false;
  task_submit: boolean = false;

  submitForm = new FormGroup({
    submit: new FormControl(null, Validators.required)
  })
constructor(private authService: AuthService, private userService: UserService, private frameworkService: FrameworkService, private route: ActivatedRoute,  private router: Router, private courseService: CourseService, private tasksService: TaskService) { }

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

          this.tasksService.getTaskDetails(Number(this.id_task)).subscribe((tasks: any) => {
            if(tasks.status == 200) {
              this.task_data = tasks.data;

              this.tasksService.getSubmitDetails(Number(this.id_task), Number(localStorage.getItem('id'))).subscribe((submit: any) => {
                if(submit.status == 200) {
                  this.task_data.submit = submit.data;
                  this.task_submit = true;
                  this.view_submit = true;
                }

                this.dataLoaded = Promise.resolve(true);
              });
            }
          });
        }
      });

    }
  },
  error => {
    this.router.navigate(['/login']);
  });
}

changeViewSubmit(bool: boolean) {
  this.view_submit = bool;
  this.task_submit = false;
}

changeTaskSubmit(bool: boolean) {
  this.task_submit = bool;
}

uploadImage(event: any){
  this.files = event.target.files[0];
}

onSubmit() {
  if(this.submitForm.invalid) {
    this.alreadySubmit = true;
    return;
  }
  
  const formData = new FormData();
  if(this.files != null) {
    formData.append("img", this.files, this.files.name);
  }

  
  this.frameworkService.upload_file(formData).subscribe((result: any) => {
    var json = {"file": result.data, "comments": String(this.submitForm.get("submit")?.value)};
    
    this.tasksService.uploadTask(Number(this.id_task), Number(this.id_course), Number(localStorage.getItem('id')), String(JSON.stringify(json))).subscribe((submit: any) => {
      if(submit.status == 200) {
        this.router.navigate(["/manager/course/"+this.id_course+"/tasks"]);
      }
    });
  });
}

}