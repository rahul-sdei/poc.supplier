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

  constructor(private router: Router,
      private route: ActivatedRoute,
      private ngZone: NgZone,
      private changeDetectorRef: ChangeDetectorRef,
  ) {
      super();
  }

  ngAfterViewInit() {
    let ctx = document.getElementById("myChart");
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
            datasets: [{
                label: 'Bookings',
                data: [12, 19, 13, 16, 14, 18],
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
                data: [1750, 1550, 1950, 1450, 1850, 2050],
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
    var d = document.getElementById("main");
    d.className = "supplier-dashboard summary";
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
    })
  }

  get pageArr() {
      return this.items;
  }

}
