import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoneThroughComponent } from './gone-through.component';

describe('GoneThroughComponent', () => {
  let component: GoneThroughComponent;
  let fixture: ComponentFixture<GoneThroughComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoneThroughComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoneThroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
