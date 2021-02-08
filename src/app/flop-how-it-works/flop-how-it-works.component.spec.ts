import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlopHowItWorksComponent } from './flop-how-it-works.component';

describe('FlopHowItWorksComponent', () => {
  let component: FlopHowItWorksComponent;
  let fixture: ComponentFixture<FlopHowItWorksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlopHowItWorksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlopHowItWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
