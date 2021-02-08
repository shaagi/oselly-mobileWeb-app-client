import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberInterestedInviteComponent } from './member-interested-invite.component';

describe('MemberInterestedInviteComponent', () => {
  let component: MemberInterestedInviteComponent;
  let fixture: ComponentFixture<MemberInterestedInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberInterestedInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberInterestedInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
