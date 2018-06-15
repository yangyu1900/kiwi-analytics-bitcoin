import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  latestPrice: any;
  latestOrderBook: any;

  constructor() {
  }

  ngOnInit(): void {
    this.customizeTabLabels();
  }

  customizeTabLabels() {
    $(".mat-tab-labels").css({ "display": "flex", "flex-direction": "row", "justify-content": "center", "align-items": "center" });
  }

  onLatestPrice(latestPrice) {
    this.latestPrice = latestPrice;
  }

  onLatestOrderBook(latestOrderBook) {
    this.latestOrderBook = latestOrderBook;
  }

}
