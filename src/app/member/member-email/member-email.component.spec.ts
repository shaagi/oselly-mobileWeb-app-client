import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEmailComponent } from './member-email.component';

describe('MemberEmailComponent', () => {
  let component: MemberEmailComponent;
  let fixture: ComponentFixture<MemberEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
