import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceClosedComponent } from './replace-closed.component';

describe('ReplaceClosedComponent', () => {
  let component: ReplaceClosedComponent;
  let fixture: ComponentFixture<ReplaceClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplaceClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
