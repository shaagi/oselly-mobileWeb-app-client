import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMemberEnterCorrectEmailComponent } from './member-member-enter-correct-email.component';

describe('MemberMemberEnterCorrectEmailComponent', () => {
  let component: MemberMemberEnterCorrectEmailComponent;
  let fixture: ComponentFixture<MemberMemberEnterCorrectEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberMemberEnterCorrectEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberMemberEnterCorrectEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
