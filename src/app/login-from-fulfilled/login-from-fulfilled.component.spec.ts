import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFromFulfilledComponent } from './login-from-fulfilled.component';

describe('LoginFromFulfilledComponent', () => {
  let component: LoginFromFulfilledComponent;
  let fixture: ComponentFixture<LoginFromFulfilledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginFromFulfilledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFromFulfilledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
