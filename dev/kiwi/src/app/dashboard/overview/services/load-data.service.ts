import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadDataService {

  constructor(private http: Http) { }

  loadLastDayHistoricRatesPerMin(): Observable<any> {
    let targetUrl = "/kiwi/product/getLastDayHistoricRatesPerMin";
    return this.http.get(targetUrl);
  }

  loadCurrentRate(): Observable<any> {
    let targetUrl = "/kiwi/product/getCurrentRate";
    return this.http.get(targetUrl);
  }

  loadProductOrderBook(): Observable<any> {
    let targetUrl = "/kiwi/orderbook/getProductOderBook";
    return this.http.get(targetUrl);
  }

  loadNews(): Observable<any> {
    let targetUrl = "/kiwi/news/getNews";
    return this.http.get(targetUrl);
  }
}
