import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FrameworkService } from './framework.service';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {

  constructor(private frameworkService: FrameworkService) { }

  givePoints(id_user: number, id_request_user: number, badges: string) {
    return this.frameworkService.post('badges/give-points', { id_user, id_request_user, badges });
  }
}
