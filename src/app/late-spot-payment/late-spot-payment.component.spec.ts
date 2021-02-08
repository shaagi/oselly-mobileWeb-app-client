import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateSpotPaymentComponent } from './late-spot-payment.component';

describe('LateSpotPaymentComponent', () => {
  let component: LateSpotPaymentComponent;
  let fixture: ComponentFixture<LateSpotPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateSpotPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateSpotPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
