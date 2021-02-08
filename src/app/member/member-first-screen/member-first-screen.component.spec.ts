import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberFirstScreenComponent } from './member-first-screen.component';

describe('MemberFirstScreenComponent', () => {
  let component: MemberFirstScreenComponent;
  let fixture: ComponentFixture<MemberFirstScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberFirstScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFirstScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
