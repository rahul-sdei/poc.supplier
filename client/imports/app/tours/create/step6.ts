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

@Component({
  selector: '',
  template
})
export class CreateTourStep6Component extends MeteorComponent implements OnInit {
    tourDetails: Tour;

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
      let step3Details = this.sessionStorage.retrieve("step3Details");
      let step4Details = this.sessionStorage.retrieve("step4Details");
      let step5Details = this.sessionStorage.retrieve("step5Details");

      this.tourDetails = _.extend({}, step1Details, step3Details, step4Details, step5Details);
      console.log("tourDetails:", this.tourDetails);
    }

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "";
    }

    ngOnDestroy() {
    }
}
