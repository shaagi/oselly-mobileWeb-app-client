import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostEmailCorrectOrNotComponent } from './host-email-correct-or-not.component';

describe('HostEmailCorrectOrNotComponent', () => {
  let component: HostEmailCorrectOrNotComponent;
  let fixture: ComponentFixture<HostEmailCorrectOrNotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostEmailCorrectOrNotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostEmailCorrectOrNotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
