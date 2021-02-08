import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMemberFaqComponent } from './member-member-faq.component';

describe('MemberMemberFaqComponent', () => {
  let component: MemberMemberFaqComponent;
  let fixture: ComponentFixture<MemberMemberFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberMemberFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberMemberFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
