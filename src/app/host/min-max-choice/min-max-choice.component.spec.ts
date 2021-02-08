import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinMaxChoiceComponent } from './min-max-choice.component';

describe('MinMaxChoiceComponent', () => {
  let component: MinMaxChoiceComponent;
  let fixture: ComponentFixture<MinMaxChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinMaxChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinMaxChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
