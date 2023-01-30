import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginasRoutingModule} from "./paginas-routing.module";
import {ArticulosPageComponent} from "./articulos-page/articulos-page.component";
import { FotosPageComponent } from './fotos-page/fotos-page.component';
import { FotosDetailPageComponent } from './fotos-detail-page/fotos-detail-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ArticulosPageComponent,
    FotosPageComponent,
    FotosDetailPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PaginasRoutingModule
  ]
})
export class PaginasModule {
}
