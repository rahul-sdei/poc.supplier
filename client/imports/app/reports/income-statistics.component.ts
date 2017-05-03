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
  constructor(private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
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

    let dataSet = [100, 50, 150 , 250, 100, 300];
    let ctx = document.getElementById("reportChart");
    let myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
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
  }
}
