import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FrameworkService } from './framework.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private frameworkService: FrameworkService, private router : Router) { }

  getDetails(id_course: string) {
    return this.frameworkService.post('course/get-details', { id_course });
  }
}
