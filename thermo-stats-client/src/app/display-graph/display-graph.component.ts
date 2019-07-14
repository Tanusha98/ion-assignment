import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { RetrieveDataService } from "../services/retrieve/retrieve-data.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-display-graph",
  templateUrl: "./display-graph.component.html",
  styleUrls: ["./display-graph.component.scss"]
})
export class DisplayGraphComponent implements OnInit {
  fromDate = new FormControl(new Date());
  toDate = new FormControl(new Date());

  chart: Chart;
  constructor(private retrieveDataService: RetrieveDataService) {}

  ngOnInit() {}
  getChart() {
    this.retrieveDataService
      .getData(
        new Date(this.fromDate.value).getTime(),
        new Date(this.toDate.value).getTime()
      )
      .subscribe(arrayData => {
        const dates = [];
        arrayData.forEach(tempNode => {
          const temp = tempNode.val;
          const date = new Date(tempNode.ts);
          dates.push(
            date.toLocaleTimeString("en", {
              year: "numeric",
              month: "short",
              day: "numeric"
            })
          );
        });
        this.chart = new Chart("canvas", {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                data: arrayData.map(node => {
                  return { x: new Date(node.ts), y: node.val };
                }),
                borderColor: "#3cba9f",
                fill: false,
                lineTension:0,
              }
            ]
          },
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [
                {
                  display: true,
                  type: "time",
                  distribution:'linear',
                  time: {
                    displayFormats: {
                      quarter: "MMM YYYY"
                    }
                  }
                }
              ],
            },
          }
        });
      });
  }
}
