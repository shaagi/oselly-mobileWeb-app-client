import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GymNameAndPicComponent } from './gym-name-and-pic.component';

describe('GymNameAndPicComponent', () => {
  let component: GymNameAndPicComponent;
  let fixture: ComponentFixture<GymNameAndPicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GymNameAndPicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GymNameAndPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
