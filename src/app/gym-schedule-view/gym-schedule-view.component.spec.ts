import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GymScheduleViewComponent } from './gym-schedule-view.component';

describe('GymScheduleViewComponent', () => {
  let component: GymScheduleViewComponent;
  let fixture: ComponentFixture<GymScheduleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GymScheduleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GymScheduleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
