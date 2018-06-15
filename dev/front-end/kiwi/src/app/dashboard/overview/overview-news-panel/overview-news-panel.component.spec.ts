import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewNewsPanelComponent } from './overview-news-panel.component';

describe('OverviewNewsPanelComponent', () => {
  let component: OverviewNewsPanelComponent;
  let fixture: ComponentFixture<OverviewNewsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewNewsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewNewsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
