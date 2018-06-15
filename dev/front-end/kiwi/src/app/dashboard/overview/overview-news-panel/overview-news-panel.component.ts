import { LoadDataService } from '../services/load-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview-news-panel',
  templateUrl: './overview-news-panel.component.html',
  styleUrls: ['./overview-news-panel.component.css']
})
export class OverviewNewsPanelComponent implements OnInit {
  newsItems: Array<any>;

  constructor(private loadDataService: LoadDataService) { }

  ngOnInit() {
    this.initNews();
    setInterval(
      () => {
        this.initNews();
      }, 900000
    );
  }

  initNews() {
    this.loadDataService.loadNews().subscribe(
      data => {
        // console.log(data.json());
        this.newsItems = data.json();
        $(document).ready(
          () => {
            let width = (document.querySelector(".overview-news-panel-content") as any).offsetWidth;
            this.addKeyFrames("-" + width + "px");
            document.querySelector(".overview-news-panel .overview-news-panel-container").className += " rowleft";
            this.onHover();
          }
        );
      }
    );
  }

  addKeyFrames(width) {
    var style = document.createElement('style');
    style.type = 'text/css';
    var keyFrames = '\
    @-webkit-keyframes rowleft {\
        0% {\
            -webkit-transform: translateX(0);\
            transform: translateX(0);\
        }\
        100% {\
            -webkit-transform: translateX(A_DYNAMIC_VALUE);\
            transform: translateX(A_DYNAMIC_VALUE);\
        }\
    }\
    @keyframes rowleft {\
        0% {\
            -webkit-transform: translateX(0);\
            transform: translateX(0);\
        }\
        100% {\
            -webkit-transform: translateX(A_DYNAMIC_VALUE);\
            transform: translateX(A_DYNAMIC_VALUE);\
        }\
    }';
    style.innerHTML = keyFrames.replace(/A_DYNAMIC_VALUE/g, width);
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  onHover() {
    $(document).ready(
      () => {
        $(".news-item").hover(
          () => {
            $("#overview-news-panel-container").css({ "animation-play-state": "paused", "webkit-animation-play-state": "paused" });
          },
          () => {
            $("#overview-news-panel-container").css({ "animation-play-state": "running", "webkit-animation-play-state": "running" });
          }
        );
      }
    );
  }

}
