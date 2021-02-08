import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberHowToInviteComponent } from './member-how-to-invite.component';

describe('MemberHowToInviteComponent', () => {
  let component: MemberHowToInviteComponent;
  let fixture: ComponentFixture<MemberHowToInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberHowToInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberHowToInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
