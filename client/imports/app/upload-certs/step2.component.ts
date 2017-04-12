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

import template from "./step1.component.html";

declare var jQuery:any;

@Component({
  selector: '',
  template
})
export class UploadCertStep2Component extends MeteorComponent implements OnInit, AfterViewChecked, OnDestroy {
  constructor(private router: Router,
      private route: ActivatedRoute,
      private ngZone: NgZone,
      private changeDetectorRef: ChangeDetectorRef,
  ) {
      super();
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    var d = document.getElementById("");
  }
}
