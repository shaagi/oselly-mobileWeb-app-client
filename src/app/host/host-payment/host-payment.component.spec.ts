import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPaymentComponent } from './host-payment.component';

describe('HostPaymentComponent', () => {
  let component: HostPaymentComponent;
  let fixture: ComponentFixture<HostPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
