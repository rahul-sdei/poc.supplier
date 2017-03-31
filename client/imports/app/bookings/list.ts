import { Meteor } from "meteor/meteor";
import { Component, OnInit, OnDestroy, NgZone, AfterViewInit, AfterViewChecked } from "@angular/core";
import { Observable, Subscription, Subject, BehaviorSubject } from "rxjs";
import { PaginationService } from "ng2-pagination";
import { MeteorObservable } from "meteor-rxjs";
import { InjectUser } from "angular2-meteor-accounts-ui";
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { ChangeDetectorRef } from "@angular/core";
import { Booking } from "../../../../both/models/booking.model";
import { showAlert } from "../shared/show-alert";
import { Roles } from 'meteor/alanning:roles';

import template from "./list.html";

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

declare var jQuery:any;

@Component({
  selector: '',
  template
})
export class BookingsPageComponent extends MeteorComponent implements OnInit, AfterViewChecked, OnDestroy {
    items: Booking[];
    pageSize: Subject<number> = new Subject<number>();
    curPage: Subject<number> = new Subject<number>();
    orderBy: Subject<string> = new Subject<string>();
    nameOrder: Subject<number> = new Subject<number>();
    optionsSub: Subscription;
    itemsSize: number = -1;
    searchSubject: Subject<string> = new Subject<string>();
    searchString: string = "";
    whereCond: Subject<any> = new Subject<any>();
    searchTimeout: any;

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

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "supplier-dashboard summary tours booking";
    }

    private setOptions() {
        let options = {
            limit: 10,
            curPage: 1,
            orderBy: "createdAt",
            nameOrder: -1,
            searchString: '',
            where: {"active": true, "confirmed": false}
        }

        this.setOptionsSub();

        this.paginationService.register({
        id: "bookings",
        itemsPerPage: 10,
        currentPage: options.curPage,
        totalItems: this.itemsSize
        });

        this.pageSize.next(options.limit);
        this.curPage.next(options.curPage);
        this.orderBy.next(options.orderBy);
        this.nameOrder.next(options.nameOrder);
        this.searchSubject.next(options.searchString);
        this.whereCond.next(options.where);
    }

    private setOptionsSub() {
        this.optionsSub = Observable.combineLatest(
            this.pageSize,
            this.curPage,
            this.orderBy,
            this.nameOrder,
            this.whereCond,
            this.searchSubject
        ).subscribe(([pageSize, curPage, orderBy, nameOrder, where, searchString]) => {
            //console.log("inside subscribe");
            const options: Options = {
                limit: pageSize as number,
                skip: ((curPage as number) - 1) * (pageSize as number),
                sort: { [orderBy]: nameOrder as number }
            };
            //console.log("options;", options);

            this.paginationService.setCurrentPage("bookings", curPage as number);

            this.searchString = searchString;
            jQuery(".loading").show();
            this.call("bookings.find", options, where, searchString, (err, res) => {
                jQuery(".loading").hide();
                if (err) {
                    showAlert("Error while fetching bookings list.", "danger");
                    return;
                }
                //console.log("res:", res.data);
                this.items = res.data;
                this.itemsSize = res.count;
                this.paginationService.setTotalItems("bookings", this.itemsSize);
            })
        });
    }

    get pageArr() {
        return this.items;
    }

    search(value: string): void {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.searchSubject.next(value);
      }, 500);
    }

    clearsearch(value: string): void {
        clearTimeout(this.searchTimeout);
    }

    onPageChanged(page: number): void {
        this.curPage.next(page);
    }

    changeOrderBy(sortBy: string): void {
      switch(sortBy) {
        case 'Booking Date (ASC)':
        this.orderBy.next("bookingDate");
        this.nameOrder.next(1);
        break;
        case 'Booking Date (DESC)':
        this.orderBy.next("bookingDate");
        this.nameOrder.next(-1);
        break;
        case 'Tour (A-Z)':
        this.orderBy.next("tour.title");
        this.nameOrder.next(1);
        break;
        case 'Tour (Z-A)':
        this.orderBy.next("tour.title");
        this.nameOrder.next(-1);
        break;
        case 'Departure Date (ASC)':
        this.orderBy.next("departureDate");
        this.nameOrder.next(1);
        break;
        case 'Departure Date (DESC)':
        this.orderBy.next("departureDate");
        this.nameOrder.next(-1);
        break;
        case 'Contact Person (A-Z)':
        this.orderBy.next("contactDetails.firstName");
        this.nameOrder.next(1);
        break;
        case 'Contact Person (Z-A)':
        this.orderBy.next("contactDetails.firstName");
        this.nameOrder.next(-1);
        break;
        case 'Travellers (ASC)':
        this.orderBy.next("numOfTravellers");
        this.nameOrder.next(1);
        break;
        case 'Travellers (DESC)':
        this.orderBy.next("numOfTravellers");
        this.nameOrder.next(-1);
        break;
        default:
        this.orderBy.next("bookingDate");
        this.nameOrder.next(-1);
        break;
      }
    }

    changeSortOrder(nameOrder: string): void {
        this.nameOrder.next(parseInt(nameOrder));
    }

    changeStatus(confirmed: boolean): void {
      this.whereCond.next({active: true, confirmed: confirmed, completed: false});
    }

    showCompleted(): void {
      this.whereCond.next({active: true, completed: true})
    }

    ngOnDestroy() {
        this.optionsSub.unsubscribe();
    }

    ngAfterViewInit() {
        jQuery(function($){
        /*$('select').material_select();
        $('.tooltipped').tooltip({delay: 50});*/

        $(".tab_content").hide();
        $(".tab_content:first").show();


        $("ul.tabs li").click(function() {
        	alert("here");
          $(".tab_content").hide();
          var activeTab = $(this).attr("rel");
          $("#"+activeTab).show();

          $("ul.tabs li").removeClass("active");
          $(this).addClass("active");

          $(".tab_drawer_heading").removeClass("d_active");
          $(".tab_drawer_heading[rel^='"+activeTab+"']").addClass("d_active");

        });

        $(".tab_drawer_heading").click(function() {

          $(".tab_content").hide();
          var d_activeTab = $(this).attr("rel");
          $("#"+d_activeTab).show();

          $(".tab_drawer_heading").removeClass("d_active");
          $(this).addClass("d_active");

          $("ul.tabs li").removeClass("active");
          $("ul.tabs li[rel^='"+d_activeTab+"']").addClass("active");
        });
        })
    }
}
