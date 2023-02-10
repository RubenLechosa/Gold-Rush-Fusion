import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FrameworkService } from './framework.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private frameworkService: FrameworkService, private router : Router) { }

  login(email: string, password: string) {
    return this.frameworkService.post('login', { email, password });
  }

  register(nick: string, name: string, last_name: string, email: string, college: string, password: string, password_confirmation: string) {
    return this.frameworkService.post('register', { nick, name, last_name, email, college, password, password_confirmation });
  }

  getUserDetails(id_user: string) {
    return this.frameworkService.post('users/get-user', { id_user });
  }

  getCourses(id_user: string) {
    return this.frameworkService.post('users/get-courses', { id_user });
  }

  getUsersByCollege(id_college: string) {
    return this.frameworkService.post('users/get-users-college', { id_college });
  }

  getTeachersByCollege(id_college: string) {
    return this.frameworkService.post('users/get-teachers-college', { id_college });
  }

  editUser(id_user: number, name: string, last_name: string, nick: string, email: string, role: string, birth_date: string) {
    return this.frameworkService.post('users/edit-user', { id_user, name, last_name, nick, email, role, birth_date});
  }

  addCourse(id_course: string, id_user: string) {
    return this.frameworkService.post('users/add-course', { id_user, id_course });
  }
}
