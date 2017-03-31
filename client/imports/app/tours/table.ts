import { Meteor } from "meteor/meteor";
import { MeteorComponent } from 'angular2-meteor';
import { Component, Input, OnInit, OnDestroy, NgZone, AfterViewInit, AfterViewChecked } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { Tour } from "../../../../both/models/tour.model";

import template from "./table.html";

@Component({
  selector: 'tours-table',
  template
})
export class ToursTableComponent extends MeteorComponent {
    @Input() pageArr: Tour[];
    @Input() itemsSize: number = -1;

  constructor() {
    super();
  }
}
