import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewChartPanelComponent } from './overview-chart-panel.component';

describe('OverviewChartPanelComponent', () => {
  let component: OverviewChartPanelComponent;
  let fixture: ComponentFixture<OverviewChartPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewChartPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewChartPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
