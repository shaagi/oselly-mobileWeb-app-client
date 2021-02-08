import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FulfilledGameInfoComponent } from './fulfilled-game-info.component';

describe('FulfilledGameInfoComponent', () => {
  let component: FulfilledGameInfoComponent;
  let fixture: ComponentFixture<FulfilledGameInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulfilledGameInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FulfilledGameInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
