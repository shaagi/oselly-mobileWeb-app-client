import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEmailCorrectOrNotComponent } from './member-email-correct-or-not.component';

describe('MemberEmailCorrectOrNotComponent', () => {
  let component: MemberEmailCorrectOrNotComponent;
  let fixture: ComponentFixture<MemberEmailCorrectOrNotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberEmailCorrectOrNotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberEmailCorrectOrNotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
