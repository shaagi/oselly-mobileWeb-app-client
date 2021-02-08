import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebookExplanationComponent } from './prebook-explanation.component';

describe('PrebookExplanationComponent', () => {
  let component: PrebookExplanationComponent;
  let fixture: ComponentFixture<PrebookExplanationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrebookExplanationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrebookExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
