import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectFormFilledComponent } from './reject-form-filled.component';

describe('RejectFormFilledComponent', () => {
  let component: RejectFormFilledComponent;
  let fixture: ComponentFixture<RejectFormFilledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectFormFilledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectFormFilledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
