import { Injectable } from '@angular/core';
import { FrameworkService } from './framework.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private frameworkService: FrameworkService) { }

  getTasksList(id_course: number) {
    return this.frameworkService.post('tasks/get-tasks-list', { id_course });
  }

  getTaskDetails(id_task: number) {
    return this.frameworkService.post('tasks/get-task', { id_task });
  }

  removeTask(id_task: number) {
    return this.frameworkService.post('tasks/delete-task', { id_task });
  }

  getCategories(id_course: number) {
    return this.frameworkService.post('tasks/get-categories', { id_course });
  }
}
