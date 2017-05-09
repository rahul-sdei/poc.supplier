import { Component, OnInit, AfterViewInit, AfterViewChecked, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { Observable, Subscription, Subject, BehaviorSubject } from "rxjs";
import { ChangeDetectorRef } from "@angular/core";
import { InjectUser } from "angular2-meteor-accounts-ui";
import { SessionStorageService } from 'ng2-webstorage';
import { Tour } from "../../../../both/models/tour.model";
import { showAlert } from "../shared/show-alert";
import * as moment from 'moment';
import template from './view.html';

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

interface DateRange {
  _id: string;
  startDate: Date;
  endDate: Date;
  price?: [{
    numOfPersons: number;
    adult: number;
    child: number;
  }],
  numOfSeats: number;
  soldSeats: number;
  availableSeats: number;
}

@Component({
  selector: '',
  template
})
@InjectUser('user')
export class TourViewComponent extends MeteorComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  paramsSub: Subscription;
  query: string;
  error: string;
  tour: Tour;
  selDateRange: DateRange = null;

  constructor(private zone: NgZone, private router: Router, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef, private sessionStorage: SessionStorageService) {
    super();
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['id'])
      .subscribe(id => {
          this.query = id;

          this.call("tours.findOne", {_id: this.query}, (err, res) => {
            if (err) {
              console.log(err.reason, "danger");
              return;
            }

            this.tour = <Tour>res;
            this.changeDetectorRef.detectChanges();
          })
        });
  }

  ngAfterViewChecked() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }


  scrollToDiv(elemId) {
    jQuery('html, body').animate({
        scrollTop: jQuery("#" + elemId).offset().top
    }, 500);
  }

  detectChanges() {
    this.changeDetectorRef.detectChanges();
  }

  isAvailSchedule(row: DateRange) {
    let startDate = new Date(row.startDate);
    let a = moment.utc(startDate);
    a.set({hour:0,minute:0,second:0,millisecond:0})
    let b = moment.utc(new Date());
    b.set({hour:0,minute:0,second:0,millisecond:0})
    let diff = a.diff(b, 'days');
    if (diff <= 0) {
      return false;
    }
    return true;
  }

  get tourDetails() {
    return this.tour;
  }

}
