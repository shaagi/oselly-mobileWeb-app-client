import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostEnterCorrectEmailComponent } from './host-enter-correct-email.component';

describe('HostEnterCorrectEmailComponent', () => {
  let component: HostEnterCorrectEmailComponent;
  let fixture: ComponentFixture<HostEnterCorrectEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostEnterCorrectEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostEnterCorrectEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
