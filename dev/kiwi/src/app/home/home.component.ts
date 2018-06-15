import { fadeIn } from '../animations/fade-in';
import { Component, OnInit } from '@angular/core';
import { LocalDataLoader } from './utils/local-data-loader';

declare var AmCharts: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [fadeIn]
})
export class HomeComponent implements OnInit {
  priceChartData: Array<any>;
  candleChartData: Array<any>;
  depthChartData: Array<any>;
  priceChartOption: any;
  candleChartOption: any;
  depthChartOption: any;
  priceChart: any;
  candleChart: any;
  depthChart: any;

  constructor() { }

  ngOnInit() {
    this.initPriceChartData();
    this.initPriceChartOption();
    this.drawPriceChart();

    this.initCandleChartData();
    this.initCandleChartOption();
    this.drawCandleChart();

    this.initDepthChartData();
    this.initDepthChartOption();
    this.drawDepthChart();
  }

  initPriceChartData() {
    this.priceChartData = LocalDataLoader.getPriceChartData();
  }

  initPriceChartOption() {
    this.priceChartOption = {
      "type": "serial",
      "theme": "light",
      "marginRight": 25,
      "dataProvider": this.priceChartData,
      "valueAxes": [
        {
          "id": "v1",
          "position": "left",
          "gridThickness": 0,
          "labelsEnabled": false
        },
        {
          "id": "v2",
          "labelsEnabled": false,
          "position": "left",
          "gridThickness": 0
        }
      ],
      "categoryField": "date",
      "categoryAxis": {
        "minPeriod": "mm",
        "parseDates": true,
        "gridThickness": 0,
        "labelsEnabled": false
      },
      "zoomOutOnDataUpdate": false,
      "responsive": true,
      "graphs": [
        {
          "id": "g1",
          "fillAlphas": 0.4,
          "lineColor": "#4083c4",
          "lineThickness": 1,
          "valueField": "market",
          "balloonText": "<div style='margin:1px; font-size:10px;'>$[[value]]</div>"
        },
        {
          "id": "g2",
          "fillAlphas": 0,
          "lineColor": "#9acb7c",
          "lineThickness": 1,
          "valueField": "forecast",
          "balloonText": "<div style='margin:1px; font-size:10px;'>$[[value]]</div>"
        },
        {
          "lineAlpha": 0,
          "fillAlphas": 0.5,
          "lineColor": "#888888",
          "type": "column",
          "clustered": false,
          "valueField": "volume",
          "valueAxis": "v2",
          "showBalloon": false
        }
      ]
    };
  }

  drawPriceChart() {
    this.priceChart = AmCharts.makeChart("priceChart", this.priceChartOption);
  }

  initCandleChartData() {
    this.candleChartData = LocalDataLoader.getCandleChartData();
  }

  initCandleChartOption() {
    this.candleChartOption = {
      "type": "serial",
      "theme": "light",
      "valueAxes": [
        {
          "id": "v1",
          "position": "left",
          "gridThickness": 0,
          "labelsEnabled": false
        },
        {
          "id": "v2",
          "labelsEnabled": false,
          "position": "left",
          "gridThickness": 0
        }
      ],
      "categoryField": "date",
      "categoryAxis": {
        "minPeriod": "mm",
        "parseDates": true,
        "gridThickness": 0,
        "labelsEnabled": false
      },
      "dataProvider": this.candleChartData,
      "zoomOutOnDataUpdate": false,
      "responsive": true,
      "graphs": [
        {
          "id": "g1",
          "proCandlesticks": true,
          "closeField": "close",
          "fillColors": "#59a34e",
          "highField": "high",
          "lineColor": "#59a34e",
          "lineAlpha": 1,
          "lowField": "low",
          "fillAlphas": 0.9,
          "negativeFillColors": "#db4c3c",
          "negativeLineColor": "#db4c3c",
          "openField": "open",
          "title": "Price:",
          "type": "candlestick",
          "valueField": "close",
          "showBalloon": false
        },
        {
          "lineAlpha": 0,
          "fillAlphas": 0.5,
          "lineColor": "#888888",
          "type": "column",
          "clustered": false,
          "valueField": "volume",
          "valueAxis": "v2",
          "showBalloon": false
        }
      ]
    };
  }

  drawCandleChart() {
    this.candleChart = AmCharts.makeChart("candleChart", this.candleChartOption);
  }

  initDepthChartData() {
    this.depthChartData = LocalDataLoader.getDepthChartData();
  }

  initDepthChartOption() {
    this.depthChartOption = {
      "type": "serial",
      "theme": "light",
      "dataProvider": this.depthChartData,
      "categoryField": "value",
      "balloon": {
        "textAlign": "left"
      },
      "valueAxes": [{
        "gridThickness": 0,
        "labelsEnabled": false
      }],
      "categoryAxis": {
        "gridThickness": 0,
        "minHorizontalGap": 100,
        "startOnAxis": true,
        "showFirstLabel": false,
        "showLastLabel": false,
        "labelsEnabled": false
      },
      "zoomOutOnDataUpdate": false,
      "responsive": true,
      "graphs": [{
        "id": "bids",
        "fillAlphas": 0.1,
        "lineAlpha": 1,
        "lineThickness": 2,
        "lineColor": "#0f0",
        "type": "step",
        "valueField": "bidstotalvolume"
      }, {
        "id": "asks",
        "fillAlphas": 0.1,
        "lineAlpha": 1,
        "lineThickness": 2,
        "lineColor": "#f00",
        "type": "step",
        "valueField": "askstotalvolume"
      }]
    };
  }

  drawDepthChart() {
    this.depthChart = AmCharts.makeChart("depthChart", this.depthChartOption);
  }

  formatNumber(val) {
    return Math.ceil(val * 100) / 100;
  }

}
