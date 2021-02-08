import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegPaymentComponent } from './login-reg-payment.component';

describe('LoginRegPaymentComponent', () => {
  let component: LoginRegPaymentComponent;
  let fixture: ComponentFixture<LoginRegPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginRegPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRegPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
