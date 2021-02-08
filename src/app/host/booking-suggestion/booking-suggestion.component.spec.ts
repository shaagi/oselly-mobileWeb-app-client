import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSuggestionComponent } from './booking-suggestion.component';

describe('BookingSuggestionComponent', () => {
  let component: BookingSuggestionComponent;
  let fixture: ComponentFixture<BookingSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingSuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
