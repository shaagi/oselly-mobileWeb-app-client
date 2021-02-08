import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaysRangeComponent } from './user-pays-range.component';

describe('UserPaysRangeComponent', () => {
  let component: UserPaysRangeComponent;
  let fixture: ComponentFixture<UserPaysRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPaysRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaysRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
