import { Injectable } from '@angular/core';
import { FrameworkService } from './framework.service';

@Injectable({
  providedIn: 'root'
})
export class CollegeService {

  constructor(private frameworkService: FrameworkService) { }

  getCollegeDetails(id_college: string) {
    return this.frameworkService.post('college/get-college', { id_college });
  }
}
