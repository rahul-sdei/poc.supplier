import { Component, OnInit, AfterViewInit, AfterViewChecked, NgZone } from '@angular/core';
import { Meteor } from "meteor/meteor";
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationService } from "ng2-pagination";
import { MeteorComponent } from 'angular2-meteor';
import { InjectUser } from "angular2-meteor-accounts-ui";
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

declare var jQuery:any;

@Component({
  selector: "",
  template
})
@InjectUser('user')
export class ReportsComponent extends MeteorComponent implements OnInit, AfterViewInit, AfterViewChecked {
  userId: string;
  items: Booking[];
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  orderBy: Subject<string> = new Subject<string>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  itemsSize: number = -1;
  searchSubject: Subject<string> = new Subject<string>();
  searchString: string = "";
  whereCond: any = {confirmed: true};
  whereSub: Subject<any> = new Subject<any>();
  activeTab: string = "Sales";
  activeTab1: string = "Monthly";

  constructor(private router: Router,
    private route: ActivatedRoute,
    private paginationService: PaginationService,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.setOptions();
  }

  private setOptions() {
      let options = {
          limit: 10,
          curPage: 1,
          orderBy: "bookingDate",
          nameOrder: -1,
          searchString: this.searchString,
          where: this.whereCond
      }

      this.setOptionsSub();

      this.paginationService.register({
      id: "booking",
      itemsPerPage: 10,
      currentPage: options.curPage,
      totalItems: this.itemsSize
      });

      this.pageSize.next(options.limit);
      this.curPage.next(options.curPage);
      this.orderBy.next(options.orderBy);
      this.nameOrder.next(options.nameOrder);
      this.searchSubject.next(options.searchString);
      this.whereSub.next(options.where);
  }

  private setOptionsSub() {
      this.optionsSub = Observable.combineLatest(
          this.pageSize,
          this.curPage,
          this.orderBy,
          this.nameOrder,
          this.whereSub,
          this.searchSubject
      ).subscribe(([pageSize, curPage, orderBy, nameOrder, where, searchString]) => {
          //console.log("inside subscribe");
          const options: Options = {
              limit: pageSize as number,
              skip: ((curPage as number) - 1) * (pageSize as number),
              sort: { [orderBy]: nameOrder as number }
          };

          this.paginationService.setCurrentPage("booking", curPage as number);

          this.searchString = searchString;
          jQuery(".loading").show();
          this.call("bookings.find", options, where, searchString, (err, res) => {
              jQuery(".loading").hide();
              if (err) {
                  showAlert("Error while fetching booking list.", "danger");
                  return;
              }
              this.items = res.data;
              // console.log(res.data);
              this.itemsSize = res.count;
              this.paginationService.setTotalItems("booking", this.itemsSize);
          })
      });
  }

  ngAfterViewChecked() {
  }

  filterDate(startDate, endDate) {
    let where = this.whereCond;

    startDate = new Date(startDate.replace(/^(\d\d)\/(\d\d)\/(\d{4})$/, "$3/$2/$1"));
    endDate = new Date(endDate.replace(/^(\d\d)\/(\d\d)\/(\d{4})$/, "$3/$2/$1"));
    where["bookingDate"] = {$gte: startDate, $lte: endDate};

    this.whereSub.next(where);
  }

  get pageArr() {
      return this.items;
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
