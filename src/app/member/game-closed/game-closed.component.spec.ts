import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameClosedComponent } from './game-closed.component';

describe('GameClosedComponent', () => {
  let component: GameClosedComponent;
  let fixture: ComponentFixture<GameClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameClosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
