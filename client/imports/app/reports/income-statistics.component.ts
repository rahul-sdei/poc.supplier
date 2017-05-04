import { Component, OnInit, AfterViewInit, AfterViewChecked, NgZone, ViewChild } from '@angular/core';
import { Meteor } from "meteor/meteor";
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationService } from "ng2-pagination";
import { MeteorComponent } from 'angular2-meteor';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { Observable, Subscription, Subject, BehaviorSubject } from "rxjs";
import { ChangeDetectorRef } from "@angular/core";
import { Chart } from 'chart.js';
import * as _ from 'underscore';
import { showAlert } from "../shared/show-alert";

import template from "./income-statistics.html";

@Component({
  selector: "income-statistics",
  template
})
@InjectUser('user')
export class IncomeStatisticsComponent extends MeteorComponent implements OnInit, AfterViewInit {
  whereCond: any = {};
  activeTab: string = "Monthly";
  chart: any = undefined;
  monthsArr: string[] = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  constructor(private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    let date = new Date();
    date.setMonth(date.getMonth() - 5);
    date.setDate(1);
    let criteria: any = {};
    criteria.bookingDate = {$gte: date, $lte: new Date()};
    this.whereCond = criteria;

    // console.log(this.chart);
    if (this.chart === undefined) {
      this.chart = null;
      this.showMonthlyChart();
    }
  }

  ngAfterViewInit() {

    Meteor.setTimeout(() => {
      jQuery(function($){
        $('#datetimepicker1')
          .datepicker({
              format: 'dd/mm/yyyy',
              autoclose: true
          })
          .on('changeDate', function(e) {
            $('#datetimepicker2').datepicker("remove");

            let startDate = $("#datetimepicker1").datepicker("getDate");

            $('#datetimepicker2')
              .datepicker({
                  format: 'dd/mm/yyyy',
                  autoclose: true,
                  startDate: startDate
              });
          });

        $('#datetimepicker2')
          .datepicker({
              format: 'dd/mm/yyyy',
              autoclose: true,
          })
          .on('changeDate', function(e) {

          });
      });
    }, 500);

  }

  setWhereCond(where) {
    this.whereCond = {
      bookingDate: where.bookingDate
    };
    switch(this.activeTab) {
      case 'Weekly':
      this.showWeeklyChart();
      break;
      case 'Monthly':
      this.showMonthlyChart();
      break;
      case 'Yearly':
      this.showYearlyChart();
      break;
    }
  }

  showWeeklyChart() {
    let labels = [];
    let dataSet = [];
    this.call("bookings.statistics.new", this.whereCond, "weekly", (err, res) => {
      if (err) {
        console.log("Error loading weekly statistics.");
        return;
      }

      for(let i=0; i<res.length; i++) {
        let year = res[i]._id["year"];
        let month = res[i]._id["month"];
        let week = res[i]._id["week"];
        let date = getDateFromWeekNumber(year, week-1);
        let date2 = getDateFromWeekNumber(year, week-1);
        date2.setDate(date2.getDate() + 6);

        let dayNum = date.getDate();
        year = date.getFullYear().toString().substr(2);
        month = this.monthsArr[date.getMonth() + 1];

        let dayNum2 = date2.getDate();
        let year2 = date2.getFullYear().toString().substr(2);
        let month2 = this.monthsArr[date2.getMonth() + 1];

        labels.push(`${dayNum} ${month} ${year}`);
        dataSet.push(res[i].totalPrice);
      }

      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = dataSet;
      this.chart.update();
    })
  }

  showMonthlyChart() {
    let labels = [];
    let dataSet = [];
    this.call("bookings.statistics.new", this.whereCond, (err, res) => {
      if (err) {
        console.log("Error loading monthly statistics.");
        return;
      }

      for(let i=0; i<res.length; i++) {
        let month = res[i]._id["month"];
        let year = res[i]._id["year"];
        labels.push(`${this.monthsArr[month]} ${year}`);
        dataSet.push(res[i].totalPrice);
      }

      if (this.chart === null) {
        this.drawChart(labels, dataSet);
      } else {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = dataSet;
        this.chart.update();
      }
    })
  }

  showYearlyChart() {
    let labels = [];
    let dataSet = [];
    this.call("bookings.statistics.new", this.whereCond, "yearly", (err, res) => {
      if (err) {
        console.log("Error loading yearly statistics.");
        return;
      }

      for(let i=0; i<res.length; i++) {
        let year = res[i]._id["year"];
        labels.push(`${year}`);
        dataSet.push(res[i].totalPrice);
      }

      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = dataSet;
      this.chart.update();
    })
  }

  drawChart(labels, dataSet) {
    let ctx = document.getElementById("reportChart");
    let myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sales',
          data: dataSet,
          backgroundColor: [
            'rgba(231, 245, 243, 1)',
            'rgba(231, 245, 243, 1)',
            'rgba(231, 245, 243, 1)',
            'rgba(231, 245, 243, 1)',
            'rgba(231, 245, 243, 1)',
            'rgba(231, 245, 243, 1)'
          ],
          borderColor: [
            'rgba(22, 160, 133, 1)',
            'rgba(22, 160, 133, 1)',
            'rgba(22, 160, 133, 1)',
            'rgba(22, 160, 133, 1)',
            'rgba(22, 160, 133, 1)',
            'rgba(22, 160, 133, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });

    this.chart = myChart;
  }

}

function getDateFromWeekNumber(year, week) {
  var d = new Date(year, 0, 1);
  var dayNum = d.getDay();
  var diff = --week * 7;

  // If 1 Jan is Friday to Sunday, go to next week
  if (!dayNum || dayNum > 4) {
    diff += 7;
  }

  // Add required number of days
  d.setDate(d.getDate() - d.getDay() + ++diff);
  return d;
}
