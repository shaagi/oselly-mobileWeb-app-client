import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingGameInfoComponent } from './pending-game-info.component';

describe('PendingGameInfoComponent', () => {
  let component: PendingGameInfoComponent;
  let fixture: ComponentFixture<PendingGameInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingGameInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingGameInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
