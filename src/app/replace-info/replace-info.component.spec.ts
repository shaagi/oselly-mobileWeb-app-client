import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceInfoComponent } from './replace-info.component';

describe('ReplaceInfoComponent', () => {
  let component: ReplaceInfoComponent;
  let fixture: ComponentFixture<ReplaceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplaceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
