import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateSpotMarkIntSignupComponent } from './late-spot-mark-int-signup.component';

describe('LateSpotMarkIntSignupComponent', () => {
  let component: LateSpotMarkIntSignupComponent;
  let fixture: ComponentFixture<LateSpotMarkIntSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateSpotMarkIntSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateSpotMarkIntSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
