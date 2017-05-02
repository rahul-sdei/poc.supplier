import { Component, OnInit, AfterViewInit, AfterViewChecked, NgZone, ViewChild } from '@angular/core';
import { Meteor } from "meteor/meteor";
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationService } from "ng2-pagination";
import { MeteorComponent } from 'angular2-meteor';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { Observable, Subscription, Subject, BehaviorSubject } from "rxjs";
import { ChangeDetectorRef } from "@angular/core";
import { Chart } from 'chart.js';
import { SalesTableComponent } from "./table-sales";
import { PayoutsTableComponent } from "./table-payouts";
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

declare var jQuery:any;

@Component({
  selector: "",
  template
})
@InjectUser('user')
export class ReportsComponent extends MeteorComponent implements OnInit, AfterViewInit, AfterViewChecked {
  activeTab: string = "Sales";
  activeTab1: string = "Monthly";
  whereCond: any = {};
  @ViewChild (SalesTableComponent) salesTable:SalesTableComponent;
  @ViewChild (PayoutsTableComponent) payoutsTable:PayoutsTableComponent;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private paginationService: PaginationService,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
  }

  filterDate(startDate, endDate) {
    let where = this.whereCond;

    if (startDate && endDate) {
      startDate = new Date(startDate.replace(/^(\d\d)\/(\d\d)\/(\d{4})$/, "$3/$2/$1"));
      endDate = new Date(endDate.replace(/^(\d\d)\/(\d\d)\/(\d{4})$/, "$3/$2/$1"));
      where["bookingDate"] = {$gte: startDate, $lte: endDate};
    } else {
      delete where["bookingDate"];
    }

    if (this.activeTab == "Sales") {
      this.salesTable.setWhereCond(where);
    } else {
      this.payoutsTable.setWhereCond(where);
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

    Meteor.setTimeout(() => {
      jQuery(function($){
        $('#datetimepicker3')
          .datepicker({
              format: 'dd/mm/yyyy',
              autoclose: true
          })
          .on('changeDate', function(e) {
            $('#datetimepicker4').datepicker("remove");

            let startDate = $("#datetimepicker3").datepicker("getDate");
            $('#datetimepicker4')
              .datepicker({
                  format: 'dd/mm/yyyy',
                  autoclose: true,
                  startDate: startDate
              });
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
