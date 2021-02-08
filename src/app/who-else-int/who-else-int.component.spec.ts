import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoElseIntComponent } from './who-else-int.component';

describe('WhoElseIntComponent', () => {
  let component: WhoElseIntComponent;
  let fixture: ComponentFixture<WhoElseIntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoElseIntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoElseIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
