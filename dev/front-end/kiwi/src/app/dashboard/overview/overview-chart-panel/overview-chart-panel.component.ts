import { ThemeSpinner } from '../../../theme/services/theme-spinner.service';
import { LoadDataService } from '../services/load-data.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

declare var AmCharts: any;

@Component({
  selector: 'app-overview-chart-panel',
  templateUrl: './overview-chart-panel.component.html',
  styleUrls: ['./overview-chart-panel.component.css']
})
export class OverviewChartPanelComponent implements OnInit {
  priceChartData: Array<any>;
  candleChartData: Array<any>;
  depthChartData: Array<any>;
  priceChartOption: any;
  candleChartOption: any;
  depthChartOption: any;
  priceChart: any;
  candleChart: any;
  depthChart: any;
  chartIdx: number;
  reducedBook: any;

  lastDepthChartData: any;

  @Output()
  latestPrice: EventEmitter<any> = new EventEmitter();
  @Output()
  latestOrderBook: EventEmitter<any> = new EventEmitter();

  constructor(private loadDataService: LoadDataService, private spinner: ThemeSpinner) { }

  ngOnInit(): void {
    this.spinner.show();
    this.loadDataService.loadLastDayHistoricRatesPerMin().subscribe(
      data => {
        // console.log(data.json());
        this.chartIdx = 0;

        let items = data.json();
        this.latestPrice.emit(items[items.length - 1]);
        this.initPriceChartData(items);
        this.initCandleChartData(items);
        this.initPriceChartOption();
        this.drawPriceChart();

        this.loadDataService.loadProductOrderBook().subscribe(
          result => {
            let book = result.json();
            this.reducedBook =
              {
                asks: this.reduceOrderBook(book.asks.slice(0, 1250), true),
                bids: this.reduceOrderBook(book.bids.slice(0, 1250), false)
              };
            this.latestOrderBook.emit(this.reducedBook);
            this.initDepthChartData(this.reducedBook);
            this.spinner.hide();
            this.updatePriceChartsData();
            setInterval(
              () => {
                this.updatePriceChartsData();
              }, 60000
            );
            setInterval(
              () => {
                this.updateDepthChartData();
              }, 5000
            );
          }
        );
      }
    );
  }

  initPriceChartData(marketData: Array<any>) {
    this.priceChartData = [];
    // current date
    var firstDate = new Date();
    // now set 1 day back
    firstDate.setDate(firstDate.getDate() - 1);

    for (var i = 0; i < marketData.length; i++) {
      var newDate = new Date(firstDate);
      // each time we add one minute
      newDate.setMinutes(newDate.getMinutes() + i);
      // add data item to the array
      this.priceChartData.push({
        date: newDate,
        market: marketData[i].close,
        forecast: marketData[i].forecast ? marketData[i].forecast : null,
        volume: this.formatVolume(marketData[i].volume)
      });
    }
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
          "unit": "$",
          "unitPosition": "left"
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
      },
      "legend": {
        "position": "top",
        "data": [{ "title": "Market", "color": "#4083c4" }, { "title": "Forecast", "color": "#9acb7c" }],
        "markerSize": 11,
        "spacing": 0,
        "valueWidth": 0
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "JJ:NN, DD MMMM",
        "cursorPosition": "mouse",
        "zoomable": false
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
      ],
      "chartScrollbar": {
        "graph": "g1",
        "scrollbarHeight": 30,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.1,
        "selectedBackgroundColor": "#888888",
        "graphFillAlpha": 0,
        "graphLineAlpha": 0.5,
        "selectedGraphFillAlpha": 0,
        "selectedGraphLineAlpha": 1,
        "color": "#AAAAAA",
        "oppositeAxis": false
      }
    };
  }

  drawPriceChart() {
    this.priceChart = AmCharts.makeChart("overviewChart", this.priceChartOption);
    this.priceChart.addListener("dataUpdated", this.zoomChart);
  }

  updatePriceChartsData() {
    this.loadDataService.loadCurrentRate().subscribe(
      data => {
        // console.log(data.json());
        let item = data.json();
        let newDate = new Date();
        this.latestPrice.emit(item);
        this.priceChartData.shift();
        this.priceChartData.push(
          {
            date: newDate,
            market: item.close,
            volume: this.formatVolume(item.volume),
            forecast: item.forecast,
            mse: item.mse
          }
        );
        this.candleChartData.shift();
        this.candleChartData.push(
          {
            date: newDate,
            open: item.open,
            close: item.close,
            high: item.high,
            low: item.low,
            volume: this.formatVolume(item.volume)
          }
        );
        this.loadDataService.loadProductOrderBook().subscribe(
          result => {
            let book = result.json();
            this.initDepthChartData(book);
          }
        );
        switch (this.chartIdx) {
          case 0:
            this.priceChart.validateData();
            break;
          case 1:
            this.candleChart.validateData();
            break;
        }
      }
    );
  }

  initCandleChartData(marketData: Array<any>) {
    this.candleChartData = [];
    var firstDate = new Date();
    // now set 1 day back
    firstDate.setDate(firstDate.getDate() - 1);

    for (var i = 0; i < marketData.length; i++) {
      var newDate = new Date(firstDate);
      // each time we add one minute
      newDate.setMinutes(newDate.getMinutes() + i);
      // add data item to the array
      this.candleChartData.push(
        {
          date: newDate,
          open: marketData[i].open,
          close: marketData[i].close,
          high: marketData[i].high,
          low: marketData[i].low,
          volume: this.formatVolume(marketData[i].volume)
        }
      );
    }
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
          "unit": "$",
          "unitPosition": "left"
        },
        {
          "id": "v2",
          "labelsEnabled": false,
          "balloon": {
            "enabled": false
          },
          "position": "left",
          "gridThickness": 0
        }
      ],
      "categoryField": "date",
      "categoryAxis": {
        "minPeriod": "mm",
        "parseDates": true,
        "gridThickness": 0
      },
      "dataProvider": this.candleChartData,
      "chartCursor": {
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true,
        "zoomable": false
      },
      "zoomOutOnDataUpdate": false,
      "responsive": true,
      "graphs": [
        {
          "id": "g1",
          "proCandlesticks": true,
          "balloonText": "Open:<b>$[[open]]</b><br>Low:<b>$[[low]]</b><br>High:<b>$[[high]]</b><br>Close:<b>$[[close]]</b><br>Volume:<b>[[volume]]</b><br>",
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
          "valueField": "close"
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
      ],
      "chartScrollbar": {
        "graph": "g1",
        "graphType": "line",
        "scrollbarHeight": 30,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.1,
        "selectedBackgroundColor": "#888888",
        "graphFillAlpha": 0,
        "graphLineAlpha": 0.5,
        "selectedGraphFillAlpha": 0,
        "selectedGraphLineAlpha": 1,
        "color": "#AAAAAA",
        "oppositeAxis": false
      }
    };
  }

  drawCandleChart() {
    this.candleChart = AmCharts.makeChart("overviewChart", this.candleChartOption);
    this.candleChart.addListener("dataUpdated", this.zoomChart);
  }

  initDepthChartData(book: any) {
    if (this.depthChartData === undefined)
      this.depthChartData = [];
    else
      this.depthChartData.length = 0;
    let bidsTotalVolume = 0;
    let asksTotalVolume = 0;
    book.bids.forEach(
      item => {
        bidsTotalVolume += Number(item[1]);
        this.depthChartData.unshift(
          {
            value: Number(item[0]),
            bidstotalvolume: bidsTotalVolume
          }
        );
      }
    );
    book.asks.forEach(
      item => {
        asksTotalVolume += Number(item[1]);
        this.depthChartData.push(
          {
            value: Number(item[0]),
            askstotalvolume: asksTotalVolume
          }
        );
      }
    );
  }

  reduceOrderBook(arr: Array<any>, asc: boolean) {
    let reducedArr = arr.reduce(
      (total, current) => {
        let key = current[0];
        let value = Number(current[1]);
        if (total[key] == undefined) {
          total[key] = 0;
        }
        total[key] += value;
        return total;
      }, {}
    );
    let results = [];
    let k;
    for (k in reducedArr) {
      results.push([k, reducedArr[k]]);
    }
    if (asc) {
      results.sort(
        (a, b) => {
          return Number(a[0]) - Number(b[0]);
        }
      );
    } else {
      results.sort(
        (a, b) => {
          return Number(b[0]) - Number(a[0]);
        }
      );
    }
    return results;
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
        "gridThickness": 0
      }],
      "categoryAxis": {
        "gridThickness": 0,
        "minHorizontalGap": 100,
        "startOnAxis": true,
        "showFirstLabel": false,
        "showLastLabel": false,
        "labelFunction": function (label) {
          if (label)
            return "$" + label;
        }
      },
      "chartCursor": {},
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
      }],
      "chartScrollbar": {
        "scrollbarHeight": 30,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.1,
        "selectedBackgroundColor": "#888888",
        "color": "#AAAAAA",
        "oppositeAxis": false
      }
    };
  }

  drawDepthChart() {
    this.depthChart = AmCharts.makeChart("overviewChart", this.depthChartOption);
  }

  updateDepthChartData() {
    this.loadDataService.loadProductOrderBook().subscribe(
      result => {
        let book = result.json();
        this.reducedBook =
          {
            asks: this.reduceOrderBook(book.asks.slice(0, 1250), true),
            bids: this.reduceOrderBook(book.bids.slice(0, 1250), false)
          }
        this.latestOrderBook.emit(this.reducedBook);
        this.initDepthChartData(this.reducedBook);
        if (this.chartIdx == 2) {
          this.depthChart.validateData();
        }
      }
    );
  }

  formatVolume(val) {
    return Math.round(val * 100000) / 100000;
  }

  zoomChart(e) {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    let startIdx, endIdx;
    startIdx = e.chart.startIndex == 0 ? 0 : e.chart.startIndex + 1;
    endIdx = e.chart.endIndex == e.chart.dataProvider.length - 1 ? e.chart.endIndex : e.chart.endIndex + 1;
    e.chart.zoomToIndexes(startIdx, endIdx);
  }

  onSelectedIndexChange(idx) {
    this.chartIdx = idx;
    switch (idx) {
      case 0:
        this.initPriceChartOption();
        this.drawPriceChart();
        break;
      case 1:
        this.initCandleChartOption();
        this.drawCandleChart();
        break;
      case 2:
        this.initDepthChartOption();
        this.drawDepthChart();
        break;
    }
  }
}
