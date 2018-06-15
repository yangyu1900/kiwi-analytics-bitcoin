import { LoadDataService } from './services/load-data.service';
import { CommonModule } from '@angular/common';
import { OverviewRoutingModule } from './overview-routing.module';
import { NgModule } from '@angular/core';
import { OverviewComponent } from './overview.component';
import { MatTabsModule, MatIconModule } from '@angular/material';
import { OverviewChartPanelComponent } from './overview-chart-panel/overview-chart-panel.component';
import { OverviewTablePanelComponent } from './overview-table-panel/overview-table-panel.component';
import { OverviewNewsPanelComponent } from './overview-news-panel/overview-news-panel.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    OverviewRoutingModule,
  ],
  declarations: [
    OverviewComponent,
    OverviewChartPanelComponent,
    OverviewTablePanelComponent,
    OverviewNewsPanelComponent,
  ],
  providers: [
    LoadDataService,
  ]
})
export class OverviewModule { }
