import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMemberMarkIntSignupComponent } from './member-member-mark-int-signup.component';

describe('MemberMemberMarkIntSignupComponent', () => {
  let component: MemberMemberMarkIntSignupComponent;
  let fixture: ComponentFixture<MemberMemberMarkIntSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberMemberMarkIntSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberMemberMarkIntSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
