import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoElsePaidComponent } from './who-else-paid.component';

describe('WhoElsePaidComponent', () => {
  let component: WhoElsePaidComponent;
  let fixture: ComponentFixture<WhoElsePaidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoElsePaidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoElsePaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
