import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManagerRoutingModule } from "./manager-routing.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { LoaderComponent } from './loader/loader.component';
import { ProfileComponent } from './users/profile/profile.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';

@NgModule({
  declarations: [
    MainComponent,
    NavbarComponent,
    LoaderComponent,
    ProfileComponent,
    EditUserComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ManagerRoutingModule,
    HttpClientModule
  ]
})
export class ManagerModule {
  
}
