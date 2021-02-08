import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMemberEmailComponent } from './member-member-email.component';

describe('MemberMemberEmailComponent', () => {
  let component: MemberMemberEmailComponent;
  let fixture: ComponentFixture<MemberMemberEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberMemberEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberMemberEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
