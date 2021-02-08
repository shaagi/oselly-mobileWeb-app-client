import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostEmailComponent } from './host-email.component';

describe('HostEmailComponent', () => {
  let component: HostEmailComponent;
  let fixture: ComponentFixture<HostEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
