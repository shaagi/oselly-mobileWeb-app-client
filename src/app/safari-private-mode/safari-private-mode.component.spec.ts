import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafariPrivateModeComponent } from './safari-private-mode.component';

describe('SafariPrivateModeComponent', () => {
  let component: SafariPrivateModeComponent;
  let fixture: ComponentFixture<SafariPrivateModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafariPrivateModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafariPrivateModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
