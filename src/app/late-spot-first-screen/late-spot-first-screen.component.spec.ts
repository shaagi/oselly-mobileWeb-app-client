import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateSpotFirstScreenComponent } from './late-spot-first-screen.component';

describe('LateSpotFirstScreenComponent', () => {
  let component: LateSpotFirstScreenComponent;
  let fixture: ComponentFixture<LateSpotFirstScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateSpotFirstScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateSpotFirstScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
