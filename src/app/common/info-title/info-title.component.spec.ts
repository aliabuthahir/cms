import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTitleComponent } from './info-title.component';

describe('InfoTitleComponent', () => {
  let component: InfoTitleComponent;
  let fixture: ComponentFixture<InfoTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
