import { Component, OnInit, AfterViewInit, AfterViewChecked, NgZone } from '@angular/core';
import { Meteor } from "meteor/meteor";
import { InjectUser } from "angular2-meteor-accounts-ui";
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { Booking } from "../../../../both/models/booking.model";
import { Observable, Subscription, Subject, BehaviorSubject } from "rxjs";
import { ChangeDetectorRef } from "@angular/core";
import { Chart } from 'chart.js';
import * as _ from 'underscore';
import { showAlert } from "../shared/show-alert";
import template from "./reports.html";

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

@Component({
  selector: "",
  template
})
@InjectUser('user')
export class ReportsComponent extends MeteorComponent implements OnInit, AfterViewInit, AfterViewChecked {
  userId: string;
  items: Booking[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {

  }

  ngAfterViewChecked() {
    var d = document.getElementById("main");
    d.className = "report";
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

          });

        $('#datetimepicker2')
          .datepicker({
              format: 'dd/mm/yyyy',
              autoclose: true
          })
          .on('changeDate', function(e) {

          });
      });
    }, 500);

    Meteor.setTimeout(() => {
      jQuery(function($){
        $('#datetimepicker3')
          .datepicker({
              format: 'dd/mm/yyyy',
              autoclose: true
          })
          .on('changeDate', function(e) {

          });

        $('#datetimepicker4')
          .datepicker({
              format: 'dd/mm/yyyy',
              autoclose: true
          })
          .on('changeDate', function(e) {

          });
      });
    }, 500);

    let dataSet = [100, 50, 150 , 250, 100, 300];
    let ctx = document.getElementById("reportChart");
    let myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: 'Reports',
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
