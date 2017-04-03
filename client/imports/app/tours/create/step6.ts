import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { showAlert } from "../../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import { Tour } from "../../../../../both/models/tour.model";
import * as _ from 'underscore';
import template from "./step6.html";

interface DateRange {
  date: string;
  seats: number;
  price: {
    adult: number;
    child: number;
  },
  hasDeparture: any;
}

declare var jQuery:any;

@Component({
  selector: '',
  template
})
export class CreateTourStep6Component extends MeteorComponent implements OnInit {
    tourDetails: Tour;
    dateRange: DateRange[] = [];
    constructor(private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private formBuilder: FormBuilder,
        private sessionStorage: SessionStorageService
    ) {
        super();
    }

    ngOnInit() {
      let step1Details = this.sessionStorage.retrieve("step1Details");
      let step2Details = this.sessionStorage.retrieve("step2Details");
      let step3Details = this.sessionStorage.retrieve("step3Details");
      let step4Details = this.sessionStorage.retrieve("step4Details");
      let step5Details = this.sessionStorage.retrieve("step5Details");
      this.tourDetails = _.extend({}, step1Details, step2Details, step3Details, step4Details, step5Details);
      if (step2Details) {
        this.dateRange = step2Details.dateRange;
      }
    }

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "";
    }

    ngOnDestroy() {
    }

    saveTour() {
    this.call("tours.insert", this.tourDetails, (err, res) => {
      if(! err) {
        this.ngZone.run(() => {
          this.sessionStorage.clear("step1Details");
          this.sessionStorage.clear("step2Details");
          this.sessionStorage.clear("step3Details");
          this.sessionStorage.clear("step4Details");
          this.sessionStorage.clear("step5Details");
          this.router.navigate(['/tours/list']);
        })
      } else {
        showAlert("Error while saving tour data.", "danger");
      }
    });
    }
}
