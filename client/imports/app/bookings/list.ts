import { Meteor } from "meteor/meteor";
import { Component, OnInit, OnDestroy, NgZone, AfterViewInit } from "@angular/core";
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
export class BookingPageComponent extends MeteorComponent implements OnInit, OnDestroy {
    items: Booking[];
    pageSize: Subject<number> = new Subject<number>();
    curPage: Subject<number> = new Subject<number>();
    nameOrder: Subject<number> = new Subject<number>();
    optionsSub: Subscription;
    itemsSize: number = -1;
    searchSubject: Subject<string> = new Subject<string>();
    searchString: string = "";
    whereCond: Subject<any> = new Subject<any>();

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
            nameOrder: 1,
            searchString: '',
            where: {"active": true, "confirmed": false}
        }

        this.setOptionsSub();

        this.paginationService.register({
        id: this.paginationService.defaultId,
        itemsPerPage: 10,
        currentPage: options.curPage,
        totalItems: this.itemsSize
        });

        this.pageSize.next(options.limit);
        this.curPage.next(options.curPage);
        this.nameOrder.next(options.nameOrder);
        this.searchSubject.next(options.searchString);
        this.whereCond.next(options.where);
    }

    private setOptionsSub() {
        this.optionsSub = Observable.combineLatest(
            this.pageSize,
            this.curPage,
            this.nameOrder,
            this.whereCond,
            this.searchSubject
        ).subscribe(([pageSize, curPage, nameOrder, where, searchString]) => {
            //console.log("inside subscribe");
            const options: Options = {
                limit: pageSize as number,
                skip: ((curPage as number) - 1) * (pageSize as number),
                sort: { "title": nameOrder as number }
            };

            this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);

            this.searchString = searchString;
            jQuery(".loading").show();
            this.call("bookings.find", options, where, searchString, (err, res) => {
                jQuery(".loading").hide();
                if (err) {
                    showAlert("Error while fetching pages list.", "danger");
                    return;
                }
                this.items = res.data;
                //console.log(res.data);
                this.itemsSize = res.count;
                this.paginationService.setTotalItems(this.paginationService.defaultId, this.itemsSize);
            })
        });
    }

    get pageArr() {
        return this.items;
    }

    search(value: string): void {
        this.searchSubject.next(value);

    }
    /* function for clearing search */
    clearsearch(value: string): void{
        this.searchSubject.next(value);
    }

    onPageChanged(page: number): void {
        this.curPage.next(page);
    }

    changeSortOrder(nameOrder: string): void {
        this.nameOrder.next(parseInt(nameOrder));
    }

    changeStatus(confirmed: boolean): void {
      this.whereCond.next({active: true, confirmed: confirmed});
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
        })
    }
}
