import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTimingsComponent } from './check-timings.component';

describe('CheckTimingsComponent', () => {
  let component: CheckTimingsComponent;
  let fixture: ComponentFixture<CheckTimingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckTimingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckTimingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
