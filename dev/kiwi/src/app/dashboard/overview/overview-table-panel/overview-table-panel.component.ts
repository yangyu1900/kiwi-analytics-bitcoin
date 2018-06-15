import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview-table-panel',
  templateUrl: './overview-table-panel.component.html',
  styleUrls: ['./overview-table-panel.component.css']
})
export class OverviewTablePanelComponent implements OnInit {
  @Input()
  latestPrice: any;
  @Input()
  latestOrderBook: any;

  constructor() {}

  ngOnInit(): void {
  } 

  
}
