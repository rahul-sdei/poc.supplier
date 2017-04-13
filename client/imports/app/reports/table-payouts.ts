import { Meteor } from "meteor/meteor";
import { MeteorComponent } from 'angular2-meteor';
import { Component, Input, OnInit, OnDestroy, NgZone, AfterViewInit, AfterViewChecked } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';

import template from "./table-payouts.html";

@Component({
  selector: 'payouts-table',
  template
})
export class PayoutsTableComponent extends MeteorComponent {
    // @Input() pageArr: Booking[];
    @Input() itemsSize: number = -1;
    // @Input() showAction: boolean = false;
  constructor() {
    super();
  }
}
