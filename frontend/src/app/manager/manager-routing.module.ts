import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { CourseComponent } from './courses/course/course.component';
import { EditCourseComponent } from './courses/edit-course/edit-course.component';
import { RankingComponent } from './courses/ranking/ranking.component';
import { UserListComponent } from './courses/user-list/user-list.component';
import { MainComponent } from './main/main.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { ProfileComponent } from './users/profile/profile.component';


const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'user/:id', component: ProfileComponent},
  {path: 'user/edit/:id', component: EditUserComponent},
  {path: 'course/edit/:id', component: EditCourseComponent},
  {path: 'course/:id', component: CourseComponent},
  {path: 'course/:id/users', component: UserListComponent},
  {path: 'course/:id/ranking', component: RankingComponent},
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule {

}
