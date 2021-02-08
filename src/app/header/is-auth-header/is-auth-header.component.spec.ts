import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsAuthHeaderComponent } from './is-auth-header.component';

describe('IsAuthHeaderComponent', () => {
  let component: IsAuthHeaderComponent;
  let fixture: ComponentFixture<IsAuthHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsAuthHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsAuthHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
