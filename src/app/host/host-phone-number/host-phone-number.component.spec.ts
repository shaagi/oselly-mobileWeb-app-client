import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPhoneNumberComponent } from './host-phone-number.component';

describe('HostPhoneNumberComponent', () => {
  let component: HostPhoneNumberComponent;
  let fixture: ComponentFixture<HostPhoneNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostPhoneNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostPhoneNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
