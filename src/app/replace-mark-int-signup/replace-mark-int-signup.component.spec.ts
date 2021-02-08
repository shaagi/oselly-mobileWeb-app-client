import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceMarkIntSignupComponent } from './replace-mark-int-signup.component';

describe('ReplaceMarkIntSignupComponent', () => {
  let component: ReplaceMarkIntSignupComponent;
  let fixture: ComponentFixture<ReplaceMarkIntSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplaceMarkIntSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceMarkIntSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
