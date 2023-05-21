import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TresEnRayaComponent } from './tres-en-raya.component';

describe('TresEnRayaComponent', () => {
  let component: TresEnRayaComponent;
  let fixture: ComponentFixture<TresEnRayaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TresEnRayaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TresEnRayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
