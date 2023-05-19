import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperRockComponent } from './paper-rock.component';

describe('PaperRockComponent', () => {
  let component: PaperRockComponent;
  let fixture: ComponentFixture<PaperRockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperRockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperRockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
