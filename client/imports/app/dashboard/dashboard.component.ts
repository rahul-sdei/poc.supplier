import { Component, OnInit, AfterViewChecked, NgZone } from '@angular/core';
import { Meteor } from "meteor/meteor";
import { InjectUser } from "angular2-meteor-accounts-ui";
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import template from "./dashboard.html";
import { Booking } from "../../../../both/models/booking.model";
import { Observable, Subscription, Subject, BehaviorSubject } from "rxjs";
import { ChangeDetectorRef } from "@angular/core";
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
export class DashboardComponent extends MeteorComponent implements OnInit, AfterViewChecked {
  userId: string;
  items: Booking[];

  constructor(private router: Router,
      private route: ActivatedRoute,
      private ngZone: NgZone,
      private changeDetectorRef: ChangeDetectorRef,
  ) {
      super();
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
