import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEnterCorrectEmailComponent } from './profile-enter-correct-email.component';

describe('ProfileEnterCorrectEmailComponent', () => {
  let component: ProfileEnterCorrectEmailComponent;
  let fixture: ComponentFixture<ProfileEnterCorrectEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEnterCorrectEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEnterCorrectEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
