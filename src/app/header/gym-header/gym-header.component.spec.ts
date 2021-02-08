import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GymHeaderComponent } from './gym-header.component';

describe('GymHeaderComponent', () => {
  let component: GymHeaderComponent;
  let fixture: ComponentFixture<GymHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GymHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GymHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
