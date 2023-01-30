import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Subscription} from "rxjs";
import {FotosService} from "../../services/fotos.service";
import {Foto} from "../../models/foto.model";

@Component({
  selector: 'app-fotos-detail-page',
  templateUrl: './fotos-detail-page.component.html',
  styleUrls: ['./fotos-detail-page.component.css']
})
export class FotosDetailPageComponent {
  foto: Foto = {id: -1, img: '', dsc: ''};
  private sub: any;

  form = new FormGroup({
    img: new FormControl<string|null>(null, Validators.required),
    dsc: new FormControl<string|null>(null, Validators.required)
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private fotos: FotosService
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id: number = +params['id']; // (+) converts string 'id' to a number
      this.foto = this.fotos.getFotoById(id);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit() {
    if(this.fotos.editPhotoById({id: this.foto.id, img: String(this.form.get('img')?.value), dsc: String(this.form.get('dsc')?.value)})) {
      this.router.navigate(['/main/fotos']);
    }
  }
}
