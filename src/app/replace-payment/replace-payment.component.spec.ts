import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacePaymentComponent } from './replace-payment.component';

describe('ReplacePaymentComponent', () => {
  let component: ReplacePaymentComponent;
  let fixture: ComponentFixture<ReplacePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplacePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
