import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceFirstScreenComponent } from './replace-first-screen.component';

describe('ReplaceFirstScreenComponent', () => {
  let component: ReplaceFirstScreenComponent;
  let fixture: ComponentFixture<ReplaceFirstScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplaceFirstScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceFirstScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
