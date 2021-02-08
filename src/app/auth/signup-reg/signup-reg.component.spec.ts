import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupRegComponent } from './signup-reg.component';

describe('SignupRegComponent', () => {
  let component: SignupRegComponent;
  let fixture: ComponentFixture<SignupRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
