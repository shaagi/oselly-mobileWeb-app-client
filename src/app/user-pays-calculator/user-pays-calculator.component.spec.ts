import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaysCalculatorComponent } from './user-pays-calculator.component';

describe('UserPaysCalculatorComponent', () => {
  let component: UserPaysCalculatorComponent;
  let fixture: ComponentFixture<UserPaysCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPaysCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaysCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
