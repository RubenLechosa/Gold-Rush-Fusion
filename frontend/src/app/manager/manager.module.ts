import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManagerRoutingModule } from "./manager-routing.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MainComponent
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
