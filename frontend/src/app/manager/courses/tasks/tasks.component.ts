import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  dataLoaded!: Promise<boolean>;
  user_data: any;
  id_course?: number;


constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute, private courseService: CourseService) { }



ngOnInit(): void {

  this.route.params.subscribe(params => {
    this.id_course = params['id']; // (+) converts string 'id' to a number
  });


  this.userService.getUserDetails(String(localStorage.getItem('id'))).subscribe((response: any) => {
    if(response.status == 200 && response.data) {
      this.user_data = response.data;
      
      this.authService.checkPermissions(this.user_data.role);
      this.dataLoaded = Promise.resolve(true);

    } else {
      this.authService.logout();
    }
  });
}

}