import { Meteor } from "meteor/meteor";
import { Component, OnInit, OnDestroy, NgZone, AfterViewInit, AfterViewChecked } from "@angular/core";
import { Observable, Subscription, Subject, BehaviorSubject } from "rxjs";
import { MeteorObservable } from "meteor-rxjs";
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { ChangeDetectorRef } from "@angular/core";
import { Booking } from "../../../../both/models/booking.model";
import { showAlert } from "../shared/show-alert";
import { Roles } from 'meteor/alanning:roles';
import * as moment from 'moment';
import template from "./view.html";

declare var jQuery:any;

@Component({
  selector: '',
  template
})
export class BookingsViewComponent extends MeteorComponent implements OnInit, AfterViewChecked, OnDestroy {
    paramsSub: Subscription;
    item: Booking;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        super();
    }

    ngOnInit() {
        this.paramsSub = this.route.params
        .map(params => params['id'])
        .subscribe(id => {

            if (! id) {
            showAlert("Invalid booking-id supplied.");
            return;
            }

            this.call("bookings.findOne", {_id: id}, (err, res) => {
                if (err) {
                    showAlert(err.reason, "danger");
                    return;
                }

                this.item = res;
            })

        });

    }

    ngAfterViewChecked() {

    }

    get booking() {
        return this.item;
    }

    get bookingStatus() {
        let retVal = null;
        let booking = this.item;
        if (booking.confirmed !== true) {
            retVal = "New";
        } else if (booking.confirmed === true && this.booking.completed !== true) {
            retVal = "Pending";
        } else if (booking.completed === true) {
            retVal = "Completed";
        }

        return retVal;
    }

    get departInDays() {
      let booking = this.item;
      let a = moment(booking.startDate);
      let b = moment(new Date());
      let diff = a.diff(b, 'days');
      if (diff < 0) {
        diff = 0;
      }
      return diff;
    }

    approveBooking() {
      let booking = this.item;
      booking.confirmed = true;

      this.call("bookings.approve", booking._id, (err, res) => {
        if (err) {
          showAlert(err.reason, "danger");
          return;
        }

        this.changeDetectorRef.detectChanges();

        showAlert("Booking has been approved successfully.", "success");
      });
    }

    disapproveBooking() {
      let booking = this.item;
      booking.confirmed = false;

      this.call("bookings.disapprove", booking._id, (err, res) => {
        if (err) {
          showAlert(err.reason, "danger");
          return;
        }

        this.changeDetectorRef.detectChanges();

        showAlert("Booking has been disapproved successfully.", "success");
      });
    }
}