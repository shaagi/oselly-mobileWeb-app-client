import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CantMessageComponent } from './cant-message.component';

describe('CantMessageComponent', () => {
  let component: CantMessageComponent;
  let fixture: ComponentFixture<CantMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CantMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CantMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
