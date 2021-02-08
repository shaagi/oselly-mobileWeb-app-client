import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsntAuthHeaderComponent } from './isnt-auth-header.component';

describe('IsntAuthHeaderComponent', () => {
  let component: IsntAuthHeaderComponent;
  let fixture: ComponentFixture<IsntAuthHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsntAuthHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsntAuthHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
