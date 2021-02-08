import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEnterCorrectEmailComponent } from './member-enter-correct-email.component';

describe('MemberEnterCorrectEmailComponent', () => {
  let component: MemberEnterCorrectEmailComponent;
  let fixture: ComponentFixture<MemberEnterCorrectEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberEnterCorrectEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberEnterCorrectEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
