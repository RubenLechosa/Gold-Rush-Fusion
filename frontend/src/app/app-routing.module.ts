import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NotfoundPageComponent } from './notfound-page/notfound-page.component';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';

const routes: Routes = [
  {path: '', redirectTo: '/main', pathMatch: 'full'},
  {path: 'manager', loadChildren: () => import('./manager/manager.module').then((m) => m.ManagerModule)},
  {path: 'login',  component: LoginComponent},
  {path: 'register',  component: RegisterComponent},
  {path: '**', component: NotfoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
