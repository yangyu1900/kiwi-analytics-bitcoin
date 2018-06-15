import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTablePanelComponent } from './overview-table-panel.component';

describe('OverviewTablePanelComponent', () => {
  let component: OverviewTablePanelComponent;
  let fixture: ComponentFixture<OverviewTablePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewTablePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewTablePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
