import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingExpiryTimerComponent } from './booking-expiry-timer.component';

describe('BookingExpiryTimerComponent', () => {
  let component: BookingExpiryTimerComponent;
  let fixture: ComponentFixture<BookingExpiryTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingExpiryTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingExpiryTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
