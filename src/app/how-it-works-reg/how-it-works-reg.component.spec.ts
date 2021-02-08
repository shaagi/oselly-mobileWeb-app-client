import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksRegComponent } from './how-it-works-reg.component';

describe('HowItWorksRegComponent', () => {
  let component: HowItWorksRegComponent;
  let fixture: ComponentFixture<HowItWorksRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowItWorksRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
