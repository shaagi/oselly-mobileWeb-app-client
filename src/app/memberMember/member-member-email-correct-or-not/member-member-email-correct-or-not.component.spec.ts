import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMemberEmailCorrectOrNotComponent } from './member-member-email-correct-or-not.component';

describe('MemberMemberEmailCorrectOrNotComponent', () => {
  let component: MemberMemberEmailCorrectOrNotComponent;
  let fixture: ComponentFixture<MemberMemberEmailCorrectOrNotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberMemberEmailCorrectOrNotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberMemberEmailCorrectOrNotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
