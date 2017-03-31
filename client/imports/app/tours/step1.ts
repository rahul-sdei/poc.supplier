import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { showAlert } from "../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import template from "./step1.html";

@Component({
  selector: '',
  template
})
export class CreateComponent extends MeteorComponent implements OnInit {
    step1Form: FormGroup;
    error: string;
    hasGuide = false;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private formBuilder: FormBuilder,
        private sessionStorage: SessionStorageService
    ) {
        super();
    }

    ngOnInit() {
      this.step1Form = this.formBuilder.group({
        name: ['', Validators.compose([Validators.required])],
        description: ['', Validators.compose([Validators.required])],
        departure: ['', Validators.compose([Validators.required])],
        destination: ['', Validators.compose([Validators.required])],
        noOfDays: ['', Validators.compose([Validators.required])],
        noOfNights: ['', Validators.compose([Validators.required])],
        tourType: ['', Validators.compose([Validators.required])],
        tourPace: ['', Validators.compose([Validators.required])]
      });

      this.error = '';
    }

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "supplier-dashboard summary tours booking";
    }

    ngOnDestroy() {
    }

    step1() {
      let details = {
        name : this.step1Form.value.name,
        description : this.step1Form.value.description,
        departure : this.step1Form.value.departure,
        destination : this.step1Form.value.destination,
        noOfDays : this.step1Form.value.noOfDays,
        noOfNights : this.step1Form.value.noOfNights,
        tourType : this.step1Form.value.tourType,
        tourPace : this.step1Form.value.tourPace,
        hasGuide : this.hasGuide
      };
      this.sessionStorage.store("step1Details", details);
    }
}
