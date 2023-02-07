import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { EditCourseComponent } from './courses/edit-course/edit-course.component';
import { MainComponent } from './main/main.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { ProfileComponent } from './users/profile/profile.component';


const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'user/:id', component: ProfileComponent},
  {path: 'user/edit/:id', component: EditUserComponent},
  {path: 'course/edit/:id', component: EditCourseComponent},
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule {

}
