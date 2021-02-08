import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GymLoginComponent } from './gym-login.component';

describe('GymLoginComponent', () => {
  let component: GymLoginComponent;
  let fixture: ComponentFixture<GymLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GymLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GymLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
