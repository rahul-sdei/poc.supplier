import { Meteor } from "meteor/meteor";
import { MeteorComponent } from 'angular2-meteor';
import { Component, Input, OnInit, OnDestroy, NgZone, AfterViewInit, AfterViewChecked } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { Booking } from "../../../../both/models/booking.model";

import template from "./table.html";

@Component({
  selector: 'bookings-table',
  template
})
export class BookingsTableComponent extends MeteorComponent {
    @Input() pageArr: Booking[];
    @Input() itemsSize: number = -1;
    @Input() showAction: boolean = false;
  constructor() {
    super();
  }
}
