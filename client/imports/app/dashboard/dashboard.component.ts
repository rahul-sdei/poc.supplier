import { Component, OnInit, AfterViewInit, AfterViewChecked, NgZone } from '@angular/core';
import { Meteor } from "meteor/meteor";
import { InjectUser } from "angular2-meteor-accounts-ui";
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import template from "./dashboard.html";
import { Booking } from "../../../../both/models/booking.model";
import { Observable, Subscription, Subject, BehaviorSubject } from "rxjs";
import { ChangeDetectorRef } from "@angular/core";
import { Chart } from 'chart.js';
import * as _ from 'underscore';
import { showAlert } from "../shared/show-alert";

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

@Component({
  selector: "dashboard",
  template
})
@InjectUser('user')
export class DashboardComponent extends MeteorComponent implements OnInit, AfterViewInit, AfterViewChecked {
  userId: string;
  items: Booking[];
  bookingTotal: [];
  firstWeekTotal: number;
  revenueTotal: number;
  weekRevenue: number;
  week: number = 0;

  constructor(private router: Router,
      private route: ActivatedRoute,
      private ngZone: NgZone,
      private changeDetectorRef: ChangeDetectorRef,
  ) {
      super();
      this.getBookingDetails();
  }

  ngAfterViewInit() {

    let ctx3 = document.getElementById("myChart3");
    let myChart3 = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
            datasets: [{
                label: 'Views',
                data: [125, 135, 115, 145, 105, 155],
                backgroundColor: [
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)'
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
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
  }

  ngAfterViewChecked() {
  }

  ngOnInit() {
    if (! Meteor.userId()) {
      this.router.navigate(['/login']);
    } else {
      this.userId = Meteor.userId();
    }

    const options: Options = {
        limit: 10,
        skip: 0,
        sort: { "createdAt": -1 }
    };
    let where = {active: true, confirmed: false, completed: false};

    jQuery(".loading").show();
    this.call("bookings.find", options, where, "", (err, res) => {
        jQuery(".loading").hide();
        if (err) {
            showAlert("Error while fetching pages list.", "danger");
            return;
        }
        this.items = res.data;
    });
    // for (i =0; i< 6;i++) {
    //   let curr = new Date;
    //   curr.setDate(curr.getDate() - this.week);
    //   let first = curr.getDate(); // First day is the day of the month - the day of the week
    //   let last = first - 6; // last day is the first day + 6
    //   let firstday = new Date(curr.setDate(first)).toUTCString();
    //   let lastday = new Date(curr.setDate(last)).toUTCString();
    //   this.week += 6;
    //   this.call("bookings.count", {active: true, createdAt: {'$gt': lastday, '$lt': firstday}}, (err, res) => {
    //     if (! err) {
    //       this.weekTotal[i] = res.pending;
    //     }
    //   })
    // }
  }

  getBookingDetails() {
    let curr = new Date;
    curr.setDate(curr.getDate());
    let first = curr.getDate(); // First day is the day of the month - the day of the week
    let last = first - 6; // last day is the first day + 6
    let firstday = new Date(curr.setDate(first)).toUTCString();
    let lastday = new Date(curr.setDate(last)).toUTCString();
    this.call("bookings.sales", lastday, firstday, (err, res) => {
      if (! err) {
        let bookingData = res.data;
        let length = bookingData.length;
        let revenue = 0;
        for (let i=0; i< length; i++) {
          revenue += bookingData[i].totalPrice;
        }
        this.firstWeekTotal = res.count;
        this.weekRevenue = revenue;
        this.revenueTotal = [revenue,500,400,650,750,700];
        this.bookingTotal = [res.count,1,2,4,5,7];
        this.createChart();
      } else {
        console.log(err);
      }
    });
  }
  get pageArr() {
      return this.items;
  }

  createChart() {
    let ctx = document.getElementById("myChart");
    let data = [1,3,2,4,6,8];
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
            datasets: [{
                label: 'Bookings',
                data: this.bookingTotal,
                backgroundColor: [
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)'
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
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    let ctx2 = document.getElementById("myChart2");
    let myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
            datasets: [{
                label: 'Revenue',
                data: this.revenueTotal,
                backgroundColor: [
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)',
                    'rgba(22, 160, 133, 1)'
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
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
  }
}
