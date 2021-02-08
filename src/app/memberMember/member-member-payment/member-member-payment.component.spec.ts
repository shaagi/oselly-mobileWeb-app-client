import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMemberPaymentComponent } from './member-member-payment.component';

describe('MemberMemberPaymentComponent', () => {
  let component: MemberMemberPaymentComponent;
  let fixture: ComponentFixture<MemberMemberPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberMemberPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberMemberPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
