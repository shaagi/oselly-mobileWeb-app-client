import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BramptonSignupsComponent } from './brampton-signups.component';

describe('BramptonSignupsComponent', () => {
  let component: BramptonSignupsComponent;
  let fixture: ComponentFixture<BramptonSignupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BramptonSignupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BramptonSignupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
