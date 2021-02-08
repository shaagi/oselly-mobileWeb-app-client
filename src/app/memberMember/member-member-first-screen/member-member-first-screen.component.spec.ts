import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMemberFirstScreenComponent } from './member-member-first-screen.component';

describe('MemberMemberFirstScreenComponent', () => {
  let component: MemberMemberFirstScreenComponent;
  let fixture: ComponentFixture<MemberMemberFirstScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberMemberFirstScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberMemberFirstScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
