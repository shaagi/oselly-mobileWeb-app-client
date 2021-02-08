import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberFaqComponent } from './member-faq.component';

describe('MemberFaqComponent', () => {
  let component: MemberFaqComponent;
  let fixture: ComponentFixture<MemberFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
